import { User } from '../models/user.Model';
import { mail } from './email.Service';
import { Session } from '../models/session.Model';
import { constants } from '../constants';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { SetOptions, createClient } from 'redis';
import path from "path";
import fs from "fs"
import dotenv from "dotenv";
import { userDao } from '../entities/user.entity';
dotenv.config();
const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN;
const Tclient = require('twilio')(accountSid, authToken);

export class userSer{

  // REGISTER USER
  static registerUser = async (userData) => {
    try {
      // const existingUser = await User.findOne({ email: userData.email, phone: userData.phone });
      const existingUser = await userDao.getUser({ email: userData.email, phone: userData.phone });
      if (existingUser) {
        return { success: false, alreadyExists:true};
      }
      const newUser = new User(userData);
      newUser.password = await bcrypt.hash(newUser.password, 10);
      // const result = await newUser.save();
      const result = await userDao.createUser(newUser);
      if (result) {
        mail.sendVerifyMail(userData.Name, userData.email, result._id);
        return { success: true, user: result };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // VERIFY USER
  static verifyEmail = async (userId) => {
    try {
      const user = await User.findOne({ _id: userId, verified: true });
      if (user) {
        return { alreadyVerified: true };
      } else {
        const updateInfo = await User.updateOne({ _id: userId }, { $set: { verified: true } });
        console.log(updateInfo);
        return { alreadyVerified: false };
      }
    } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // LOGIN USER
  static loginUser = async (email, password) => {
    try {

      const user = await User.findOne({ email: email });

      if (!user) {
        return { user: null, pass:true };
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return { user: null, pass: false };
      }

      let token = jwt.sign({email: user.email, id:user._id}, process.env.SEC_KEY, {expiresIn: process.env.EXP})
      return { user, token };

    } catch (error) {
      console.error(error);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // GET PROFILE  
  static getUserProfile = async (userId) => {
    try {
      const user = await userDao.getUserById(userId)
      return user;
    } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // UPDATE USER
  static updateUserProfile = async (userId, userData) => {
    try {
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      const updatedProfile = await User.findByIdAndUpdate({_id: userId}, { $set: userData }, { new: true });
      return updatedProfile;
    } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // UPLOAD PIC
  static uploadProfilePic = async (userId, file) => {
    try {
      // const imagePath = '/home/admin2/Desktop/E_Learning/public/uploads/' + file.originalname;
      const imagePath = path.join(process.cwd(), 'public', 'uploads', file.originalname);
      const profilePic = fs.readFileSync(path.resolve(imagePath));
      const user = await User.findOne({ _id: userId });
      user.profilePIC = profilePic;
      await user.save();
      fs.unlink(path.resolve(imagePath), (err) => {
        if (err) {
          console.error('Error in file delete:', err);
        }
      });
      return { success: true };
    } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // DELETE USER  
  static deleteUserProfile = async (userId) => {
    try {
      const session = await Session.findOneAndUpdate(
        { userID: userId, isActive: true },
        {$set: {isActive: false }},
        { new: true }
      );
      const client = createClient();  
      client.on("error", (err) => console.log("redis Client Error", err));  
      await client.connect();
      await client.del(`status:${userId}`);
      await User.findByIdAndRemove(userId);
      return { success: true };
    } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // SEND OTP
  static sendPasswordResetOTP = async (userId) => {
    try {
      const user = await User.findOne({ _id: userId });
      // const template = fs.readFileSync('/home/admin2/Desktop/E_Learning/src/templets/otp.html', 'utf-8',);
      const template = fs.readFileSync(path.join(process.cwd(), 'src', 'templets', 'otp.html'), 'utf-8');
      const otp:any =await mail.generateOTP(6);
      const client = createClient();  
      client.on("error", (err) => console.log("redis Client Error", err));  
      await client.connect();
      const options: SetOptions = { EX: 60*2 };
      await client.set(`otp:${userId}`, otp, options);
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Password Reset OTP',
        html: template.replace('{{ name }}', user.username).replace('{{ otp }}', otp)
      };
      await mail.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // SEND OTP NUMBER
  static sendPasswordResetOTPNum = async (userId) => {
    try {
      const user = await User.findOne({ _id: userId });
      const otp:any =await mail.generateOTP(6);
      const client = createClient();  
      client.on("error", (err) => console.log("redis Client Error", err));  
      await client.connect();
      const options: SetOptions = { EX: 60*2 };
      await client.set(`otp:${userId}`, otp, options)
      await Tclient.messages.create({
        body: `Hii ${user.username},
        Please use this OTP: ${otp} to forget password.
        OTP valid only for 2 minutes`,
        from: process.env.PHONE,
        to: user.phone
      })
      return { success: true };
    } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // RESET PASSWORD
  static resetPassword = async (userId, enteredOtp, newPassword) => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const client = createClient(); 
      client.on("error", (err) => console.log("redis Client Error", err));  
      await client.connect();
      const storedOtp = await client.get(`otp:${userId}`);
      if (!storedOtp) {
        return { success: false };
      }
      if (enteredOtp == storedOtp) {
        const user = await User.findOne({ _id: userId });
        user.password = hashedPassword;
        await user.save();
        await client.del(`otp:${userId}`);
        return { success: true };
      } else {
        return { invalidOtp: true };
      }
    } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

  // LOGOUT USER
  static logoutUser = async (userId, deviceId) => {
    try {
      const session = await Session.findOneAndUpdate(
        { userId: userId, isActive: true, deviceId: deviceId },
        {$set: { isActive: false }},
        { new: true }
      );
      if (!session) {
        return { success: false, message: constants.errorMsgs.invalidToken };
      }
      const client = createClient();  
      client.on("error", (err) => console.log("redis Client Error", err));  
      await client.connect();
      await client.del(`status:${userId}`);
      return { success: true };
    } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorUser);
    }
  };

}