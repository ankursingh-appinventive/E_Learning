import { Course } from '../models/course.Model';
import { User } from "../models/user.Model";
import { Assignment } from "../models/assignment.Model";
import { Quiz } from "../models/quiz.Model";
import {PaymentModel} from "../models/payment.Model";
import { Enrollment } from "../models/enrollement.Model";
import {ProgressModel} from "../models/progress.Model";
import { constants } from '../constants';
import { mail } from './email.Service';
const {STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY} = process.env;
const stripe = require('stripe')(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27'
});
import fs from 'fs'
import path from 'path';

export class courseService{

    static createCourse = async (instructorId, courseData) => {
      try {
          const newCourse = new Course({
          title: courseData.title,
          category: courseData.category,
          instructorId: instructorId,
          description: courseData.description,
          courseFee: courseData.courseFee
          });
          const result = await newCourse.save();
          return { success: true, course: result };
      } catch (error) {
          console.error(error.message);
          throw new Error(constants.errorMsgs.errorCrs);
      }
    };

    static updateCourse = async (instructorId, courseID, courseData) => {
        try {
        const courseInst = await Course.findOne({ $and: [{ _id: courseID }, { instructorId: instructorId }] });
        if (!courseInst) {
            return { success: false, instructorMismatch: true };
        }
        const updatedCourse = await Course.findByIdAndUpdate({ _id: courseID }, { $set: courseData }, { new: true });
        if (!updatedCourse) {
            return { success: false, courseNotFound: true };
        }
        return { success: true, updatedCourse: updatedCourse };
        } catch (error) {
        console.error(error.message);
        throw new Error(constants.errorMsgs.errorCrs);
        }
    };
  
    static deleteCourse = async (instructorId, courseID) => {
        try {
        const courseInst = await Course.findOne({ $and: [{ _id: courseID }, { instructorId: instructorId }] });    
        if (!courseInst) {
            return { success: false, instructorMismatch: true };
        }    
        await Assignment.deleteMany({ _id: { $in: courseInst.assignments } });
        await Quiz.deleteMany({ _id: { $in: courseInst.quizzes } });
        const deletedCourse = await Course.findOneAndRemove({ _id: courseID });    
        if (!deletedCourse) {
            return { success: false, courseNotFound: true };
        }    
        return { success: true, deletedCourse: deletedCourse };
        } catch (error) {
        console.error(error.message);
        throw new Error(constants.errorMsgs.errorCrs);
        }
    };

    static getAllCourse = async (page, perPageData) => {
        try {
          const findCourses = await Course.find({published: true}).skip((page-1)*perPageData).limit(perPageData);
          const totalPublishedCourses = await Course.countDocuments({ published: true });
          const totalPages = Math.ceil(totalPublishedCourses / perPageData);
          if (findCourses && findCourses.length > 0) {
            return { success: true, courses: findCourses, totalPages };
          } else {
            return { success: false, noCourses: true };
          }
        } catch (error) {
          console.error(error.message);
          throw new Error(constants.errorMsgs.errorCrs);
        }
      };

      static getCourseByTitle = async (courseTitle, page, perPageData) => {
        try {
          const findCourse = await Course.find({$and :[{title: courseTitle, published: true}]}).skip((page-1)*perPageData).limit(perPageData);      
          const totalCount = await Course.countDocuments({ $and: [{ title: courseTitle, published: true }] });
          const totalPages = Math.ceil(totalCount / perPageData);
          if (findCourse) {
            return { success: true, course: findCourse, totalPages };
          } else {
            return { success: false, noCourse: true };
          }
        } catch (error) {
          console.error(error.message);
          throw new Error(constants.errorMsgs.errorCrs);
        }
      };

      static getCourseOfUser = async (userId, page, perPageData) => {
        try {  
          const findCourses = await Enrollment.find({ userId: userId }).skip((page-1)*perPageData).limit(perPageData);
          const totalCount = await Enrollment.countDocuments({ userId: userId });
          const totalPages = Math.ceil(totalCount / perPageData);
          if (findCourses && findCourses.length > 0) {
            return { success: true, courses: findCourses, totalPages};
          } else {
            return { success: false, noCourses: true };
          }
        } catch (error) {
          console.error(error.message);
          throw new Error(constants.errorMsgs.errorCrs);
        }
      };

      // static enrollCourse = async (userId, courseId) => {
      //   try {
      //     // const course = await Course.findOne({ _id: courseId, published: true});
      //     const course = await Course.findOne({ _id: courseId});
      //     let result
      //     if (!course || course.published== false) {
      //       return { success: false};
      //     }else{
      //       const enrolled = new Enrollment({
      //         userId: userId,
      //         courseId: courseId,
      //         title: course.title,
      //         enrollmentDate: Date.now()
      //       });
      //       result = await enrolled.save();
      //     }
      //     const user = await User.findOne({ _id: userId });
      //     if (result) {
      //       const courseFee = parseInt(course.courseFee)
      //       mail.sendEnrollPaymentMail2(user._id, user.username, user.email, course.title, courseFee, courseId);
      //       return { success: true, result: result };
      //     } else {
      //       return { success: false };
      //     }
      //   } catch (error) {
      //     console.error(error.message);
      //     throw new Error(constants.errorMsgs.errorCrs);
      //   }
      // };

      static enrollCourse = async (userId, courseId) => {
        try {
          // const course = await Course.findOne({ _id: courseId, published: true});
          const course = await Course.findOne({ _id: courseId});
          let result
          if (!course || course.published== false) {
            return { success: false};
          }else{
            const enrolled = new Enrollment({
              userId: userId,
              courseId: courseId,
              title: course.title,
              enrollmentDate: Date.now()
            });
            result = await enrolled.save();
          }
          const user = await User.findOne({ _id: userId });
          if (result) {
            const courseFee = parseInt(course.courseFee)
  
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
              {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: course.title,
                  },
                  unit_amount: courseFee * 100,
                },
                quantity: 1, // Assuming quantity is always 1
              },
            ],
            success_url: `http://localhost:3333/course/coursePayment?courseId=${courseId}&userId=${userId}&status=1`,//`${process.env.CLIENT_URL}/success.html`,
            cancel_url: `http://localhost:3333/course/coursePayment?courseId=${courseId}&userId=${userId}&status=0`,//`${process.env.CLIENT_URL}/cancel.html`,
          });
            console.log('url:', session.url)
            mail.sendEnrollPaymentMail( user.username, user.email, course.title, course.courseFee, session.url);
            return { success: true, result: result };
          } else {
            return { success: false };
          }
        } catch (error) {
          console.error(error.message);
          throw new Error(constants.errorMsgs.errorCrs);
        }
      };

      static coursePayment = async (userId, courseId) => {
        try {
          const findCourse = await Course.findOne({ _id: courseId });      
          if (!findCourse) {
            return { success: false};
          }
          const payment = new PaymentModel({
            userId: userId,
            courseId: courseId,
            amount: findCourse.courseFee,
            paymentDate: Date.now(),
          });
          await Enrollment.findOneAndUpdate({ courseId: courseId, userId: userId }, { $set: { payment: true } });      
          const progress = new ProgressModel({
            userId: userId,
            courseId: courseId,
          });
          await progress.save();      
          const result = await payment.save();
          return { success: true, result: result };
        } catch (error) {
          console.error(error.message);
          throw new Error(constants.errorMsgs.errorPay);
        }
      };

      static getProgress = async (userId, courseId) => {
        try {
          const findEnrollment = await Enrollment.findOne({$and: [{courseId: courseId, userId: userId}] });
          if (!findEnrollment) {
            return { success: false, notEnrolled: true };
          }
          const getProgress = await ProgressModel.findOne({ userId: userId, courseId: courseId });
          return { success: true, progress: getProgress };
        } catch (error) {
          console.error(error.message);
          throw new Error(constants.errorMsgs.errorCrs);
        }
      };
      
      static sendCertificate = async (userId, courseId) => {
        try {
          const user = await User.findOne({ _id: userId });
          const course = await Course.findOne({_id: courseId})
          const progress = await ProgressModel.findOne({userId: userId, courseId: courseId});
          if(progress.score<=70){
            return { success: false };
          }
          // const template = fs.readFileSync('/home/admin2/Desktop/E_Learning/src/templets/certificate.html', 'utf-8',);
          const templatePath = path.join(process.cwd(), 'src', 'templets', 'certificate.html');
          const template = fs.readFileSync(templatePath, 'utf-8');
          const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: `${course.tittle} Cerificate`,
            html: template.replace('{{ userName }}', user.username).replace('{{ courseName }}', course.title)
          };
          await mail.transporter.sendMail(mailOptions);
          return { success: true };
        } catch (error) {
          console.error(error.message);
          throw new Error(constants.errorMsgs.errorUser);
        }
      };

}