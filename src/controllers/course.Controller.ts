import { courseService } from "../services/course.Service";
import { constants } from "../constants";
const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
const stripe = require("stripe")(STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

import { Course, Enrollment, User } from "../models";

export class courseCont {
  // CREATE COURSE
  static createCourse = async (req: any, res: any) => {
    try {
      const createResult = await courseService.createCourse(
        req.userId,
        req.body
      );
      if (createResult.success) {
        res
          .status(200)
          .json({
            message: constants.successMags.crsCreated,
            result: createResult.course,
          });
      } else {
        res.status(500).json({ message: constants.errorMsgs.error });
      }
    } catch (error) {
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

  // UPDATE COURSE
  static updateCousrse = async (req: any, res: any) => {
    try {
      const updateResult = await courseService.updateCourse(
        req.userId,
        req.body.courseID,
        req.body
      );
      if (updateResult.success) {
        res
          .status(200)
          .json({
            message: constants.successMags.crsUpdated,
            updatedCourse: updateResult.updatedCourse,
          });
      } else if (updateResult.courseNotFound) {
        res.status(404).json({ message: constants.errorMsgs.crsError });
      } else if (updateResult.instructorMismatch) {
        res.status(400).json({ message: constants.warningMsgs.notAllowed });
      } else {
        res.status(500).json({ message: constants.errorMsgs.error });
      }
    } catch (error) {
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

  // DELETE COURSE
  static deleteCourse = async (req: any, res: any, next: any) => {
    try {
      const deleteResult = await courseService.deleteCourse(
        req.userId,
        req.query.courseID
      );

      if (deleteResult.success) {
        res
          .status(200)
          .json({
            message: constants.successMags.crsDeleted,
            deletedCourse: deleteResult.deletedCourse,
          });
      } else if (deleteResult.courseNotFound) {
        res.status(404).json({ message: constants.errorMsgs.crsError });
      } else if (deleteResult.instructorMismatch) {
        res.status(400).json({ message: constants.warningMsgs.notAllowed });
      } else {
        res.status(500).json({ message: constants.errorMsgs.error });
      }
    } catch (error) {
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

  // GET ALL COURSE
  static getAllCourse = async (req: any, res: any) => {
    try {
      const page: number = +(req.query.page || "1");
      const perPageData: number = +(req.query.limit || "10");
      const findResult = await courseService.getAllCourse(page, perPageData);
      if (findResult.success) {
        res
          .status(200)
          .json({
            totalPages: findResult.totalPages,
            courses: findResult.courses,
          });
      } else {
        res.status(400).json({ message: constants.errorMsgs.crsError });
      }
    } catch (error) {
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

  // GET COURSE BY ID
  static getCourseByTittle = async (req: any, res: any) => {
    try {
      const page: number = +(req.query.page || "1");
      const perPageData: number = +(req.query.limit || "10");
      const tittle = req.query.title;
      const findResult = await courseService.getCourseByTitle(
        tittle,
        page,
        perPageData
      );
      if (findResult.success) {
        res
          .status(200)
          .json({
            totalPages: findResult.totalPages,
            course: findResult.course,
          });
      } else {
        res.status(400).json({ message: constants.errorMsgs.crsError });
      }
    } catch (error) {
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

  // GET COURSE OF USER
  static getCourseOfUser = async (req: any, res: any) => {
    try {
      const page: number = +(req.query.page || "1");
      const perPageData: number = +(req.query.limit || "10");
      const findResult = await courseService.getCourseOfUser(
        req.userId,
        page,
        perPageData
      );
      if (findResult.success) {
        res
          .status(200)
          .json({
            totalPages: findResult.totalPages,
            courses: findResult.courses,
          });
      } else {
        res.status(400).json({ message: constants.warningMsgs.notEnrolled });
      }
    } catch (error) {
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

  // ENROLL COURSE
  static enrollCourse = async (req: any, res: any, next: any) => {
    try {
      const enrollResult = await courseService.enrollCourse(
        req.userId,
        req.query.id
      );
      if (enrollResult.success) {
        res
          .status(200)
          .json({
            message: constants.successMags.success,
            next: constants.successMags.payemet,
            enrollmentResult: enrollResult.result,
          });
      } else {
        res.status(404).json({ message: constants.errorMsgs.crsError });
      }
    } catch (error) {
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

  // COURSE PAYMENT
  static coursePayment = async (req: any, res: any, next: any) => {
    try {
      const status = req.query.status as string;
      const userId = req.query.userId as string;
      const courseId = req.query.courseId as string;
      if (status == "1") {
        const paymentResult = await courseService.coursePayment(
          userId,
          courseId
        );
        if (paymentResult.success) {
          res
            .status(200)
            .json({
              message: constants.successMags.success,
              paymentResult: paymentResult.result,
            });
        } else {
          res.status(404).json({ message: constants.errorMsgs.crsError });
        }
      } else {
        await Enrollment.findOneAndRemove({
          courseId: courseId,
          userId: userId,
        });
        res
          .status(400)
          .json({
            message:
              "Sorry you have not completed your payment please enroll again",
          });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

  // GET COURSE PROGRESS
  static getProgress = async (req: any, res: any) => {
    try {
      const progressResult = await courseService.getProgress(
        req.userId,
        req.query.id
      );
      if (progressResult.success) {
        res.status(200).json(progressResult.progress);
      } else if (progressResult.notEnrolled) {
        res.status(400).json({ message: constants.warningMsgs.notEnrolled });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

  // GET COURSE CERTIFICATE
  static getCertificate = async (req: any, res: any) => {
    const uid = req.userId;
    const courseId = req.query.id;
    try {
      const certificateRetult = await courseService.sendCertificate(
        uid,
        courseId
      );
      if (certificateRetult.success) {
        res.status(200).json({ message: constants.successMags.success });
      } else {
        res.status(403).json({ message: constants.warningMsgs.certficate });
      }
    } catch (error) {
      res.status(500).json({ message: constants.errorMsgs.error });
    }
  };

    // static renderBuyPage = async(req,res)=>{
    //   const userId = req.query.user_id;
    //   const courseId = req.query.id;
    //   const course = await Course.findOne({_id:courseId})
    //   const courseFee = parseFloat(course.courseFee);
    //     try {
    //         res.render('buy', {
    //             key: STRIPE_PUBLISHABLE_KEY,
    //             amount:courseFee,
    //             userId:userId,
    //             courseId:courseId,
    //             productName:course.title,
    //             description:course.description
    //          })
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    // static  payment = async(req,res)=>{
    //   try {
    //     const {userId, courseId} = req.body;
    //     const user = await User.findOne({_id:userId})
    //     const course = await Course.findOne({_id:courseId})
    //     console.log(req.body,user,course);
    //   stripe.customers.create({
    //       email: req.body.stripeEmail,
    //       source: req.body.stripeToken,
    //       name: user.Name
    //   })
    //   .then((customer) => {
    //     console.log(customer,"-------------------------------------------------")
    //       return stripe.paymentIntents.create({
    //           amount: req.body.amount,
    //           description: req.body.productName,
    //           currency: 'inr',
    //           customer: customer.id,
    //           payment_method_data : {
    //             type: 'card',
    //             card: {
    //               token: req.body.stripeToken, // Assuming you're using Express and the token is in the request body
    //             }
    //           },
    //       });
    //   })
    //   .then(async (charge: any) => {
    //     console.log(charge,".......................................................")
    //     const paymentResult = await courseService.coursePayment(userId, courseId);
    //     if (paymentResult.success) {
    //       res.status(200).json({ message: constants.successMags.success, paymentResult: paymentResult.result });
    //     } else{
    //       res.status(404).json({ message: constants.errorMsgs.crsError });
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("Stripe error:", err); // Log the Stripe error
    //     res.status(500).json({ message: constants.errorMsgs.error });
    //   });
    //   } catch (error) {
    //       console.log(error.message);
    //       res.status(500).json({ message: constants.errorMsgs.error });
    //   }
  }

  // // COURSE PAYMENT
  // static coursePayments = async (req: any, res: any, next: any) => {
  //   try {
  //     const userId = req.query.userId as string;
  //     const courseId = req.query.courseId as string;
  //     const course = await Course.findOne({ _id: courseId });
  //     const payment = await Enrollment.findOne({ courseId: courseId , payment: true });
  //     if (!course) {
  //       return res.status(404).json({ error: "Course not found" });
  //     }
  //     if (payment) {
  //       return res.status(404).json({ error: "Payment already done" });
  //     }
  //     const courseFee = parseInt(course.courseFee)

  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ["card"],
  //       mode: "payment",
  //       line_items: [
  //         {
  //           price_data: {
  //             currency: "inr",
  //             product_data: {
  //               name: course.title,
  //             },
  //             unit_amount: courseFee * 100,
  //           },
  //           quantity: 1, // Assuming quantity is always 1
  //         },
  //       ],
  //       success_url: 'http://localhost:3333/course/getAllCourses',//`${process.env.CLIENT_URL}/success.html`,
  //       cancel_url: 'http://localhost:3333/course/getCourse?title=Java',//`${process.env.CLIENT_URL}/cancel.html`,
  //     });

  //     // res.json({ url: session.url });
  //     console.log('url:', session.url)
  //     if(session.url == 'http://localhost:3333/course/getAllCourses'){
  //       const paymentResult = await courseService.coursePayment(userId, courseId);
  //       if (paymentResult.success) {
  //         res
  //           .status(200)
  //           .json({
  //             message: constants.successMags.success,
  //             paymentResult: paymentResult.result,
  //             url: session.url
  //           });
  //       } else {
  //         res.status(400).json({ message: constants.errorMsgs.crsError, url: session.url });
  //       }
  //     } else{
  //       res.status(500).json({ message: 'payment fail', url: session.url });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: constants.errorMsgs.error });
  //   }
  // };
