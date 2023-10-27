import express from 'express'
import { session } from '../middleware/auth';
import { userCont } from '../controllers/user.Controller';
import { validate } from '../middleware/validate';
import  middlewaremulter from '../middleware/multer';
const userRouter = express.Router();

userRouter.get("/",(req, res) => {
    res.status(200).json({message: "This is home page for E_Learning"});
})

userRouter.post("/signup", validate.validateUserSignup, userCont.register);
userRouter.get('/verify', userCont.verifyMail);
userRouter.post("/signin", validate.validateUserLogin, userCont.login);
userRouter.get('/getProfie', session.sessionCheck, userCont.getProfile);
userRouter.put("/updateProfile", validate.validateUpdateUser,session.sessionCheck, userCont.updateProfile);
userRouter.put("/uploadProfilePic", session.sessionCheck, middlewaremulter.upload.single("image"), userCont.uploadProfilePic);
userRouter.delete("/delete", session.sessionCheck, userCont.deleteU);
userRouter.get("/forgetPassword", session.sessionCheck, userCont.forgetPassword);
userRouter.get("/forgetPasswordNumber", session.sessionCheck, userCont.forgetPasswordNum);
userRouter.post("/resetPassword", validate.validateResetPassword, session.sessionCheck, userCont.resetPassword);
userRouter.get("/logout", session.sessionCheck, userCont.logout);

export default userRouter;









// import express from 'express';
// import { session } from '../middleware/auth';
// import { userCont } from '../controllers/userCont';
// import { validate } from '../middleware/validate';
// import middlewaremulter from '../middleware/multer';

// class UserRouter {
//   router: any;
//   constructor() {
//     this.router = express.Router();
//     this.initializeRoutes();
//   }

//   initializeRoutes() {
//     this.router.get("/", (req, res) => {
//       res.status(200).json({ message: "This is the home page for E_Learning" });
//     });

//     this.router.post("/signup", validate.validateUserSignup, userCont.register);
//     this.router.get('/verify', userCont.verifyMail);
//     this.router.post("/login", validate.validateUserLogin, userCont.login);
//     this.router.get('/getProfile', session.sessionCheck, userCont.getProfile);
//     this.router.delete("/delete", session.sessionCheck, userCont.deleteU);
//     this.router.get("/logout", session.sessionCheck, userCont.logout);
//     this.router.put("/updateProfile", validate.validateUpdateUser, session.sessionCheck, userCont.updateProfile);
//     this.router.put("/uploadProfilePic", session.sessionCheck, middlewaremulter.upload.single("image"), userCont.uploadProfilePic);
//     this.router.get("/forgetPassword", session.sessionCheck, userCont.forgetPassword);
//     this.router.get("/forgetPasswordNumber", session.sessionCheck, userCont.forgetPasswordNum);
//     this.router.post("/resetPassword", validate.validateResetPassword, session.sessionCheck, userCont.resetPassword);
//   }
// }

// export default UserRouter;