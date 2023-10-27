import nodemailer from 'nodemailer'
const path = require('path');
import fs from "fs"


export class mail {

      static transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      static generateOTP = async(length) =>{  const charset = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          otp += charset[randomIndex];
        }
        return otp;
      }

      static sendVerifyMail =async (name, email, user_id) => {
        try {
          const verificationLink = `http://localhost:3333/user/verify?id=${user_id}`;
          // const template = fs.readFileSync('/home/admin2/Desktop/E_Learning/src/templets/verification-email-template.html', 'utf-8',);
          const templatePath = path.join(process.cwd(), 'src', 'templets', 'verification-email-template.html');
          const template = fs.readFileSync(templatePath, 'utf-8');
          const mailOptions = {
              from: process.env.EMAIL,
              to: email,
              subject: 'Verification Mail',
              html: template.replace('{{ name }}', name).replace('{{ verificationLink }}', verificationLink)
              // html: '<p>Hii'+name+', please click here to <a href="http://localhost:3333/api/verify?id='+user_id+'"> verify </a> your mail.</p>'
            };
          this.transporter.sendMail(mailOptions, function(error,info){
              if(error){
                  console.log(error)
              }else{
                  console.log("email has been sent :-", info.response);
              }
          })
        } catch (error) {
            console.log(error.message);
        }
      }
      
      static sendEnrollPaymentMail =async (user_id, name, email, title, courseFee, course_id) => {
        try {
          // const paymentLink = `http://localhost:3333/course/coursePayment?id=${course_id}&user_id=${user_id}`;
          const paymentLink = `http://localhost:3333/course/render?id=${course_id}&user_id=${user_id}`;
          // const template = fs.readFileSync('/home/admin2/Desktop/E_Learning/src/templets/courseEnrollment.html', 'utf-8',);
          const templatePath = path.join(process.cwd(), 'src', 'templets', 'courseEnrollment.html');
          const template = fs.readFileSync(templatePath, 'utf-8');
          const mailOptions = {
              from: process.env.EMAIL,
              to: email,
              subject: 'Enrollment Confirmation & Payment Mail',
              html: template.replace('{{ userName }}', name).replace('{{ courseName }}', title).replace('{{ amount }}', courseFee).replace('{{ paymentLink }}', paymentLink)
            };
          this.transporter.sendMail(mailOptions, function(error,info){
              if(error){
                  console.log(error)
              }else{
                  console.log("email has been sent :-", info.response);
              }
          })
        } catch (error) {
            console.log(error.message);
        }
      }

}