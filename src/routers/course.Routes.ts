import express from 'express'
import { session } from '../middleware/auth';
import { courseCont } from '../controllers/course.Controller';
import { validate } from '../middleware/validate';
const courseRouter = express();

const bodyParser = require('body-parser');
courseRouter.use(bodyParser.json());
courseRouter.use(bodyParser.urlencoded({ extended:false }));

const path = require('path');

courseRouter.set('view engine','ejs');
courseRouter.set('views',path.join(__dirname, '../views'));

courseRouter.post("/createCoures", validate.validateCreateCourse, session.instructorSessionCheck, courseCont.createCourse);
courseRouter.put("/updateCourse", session.instructorSessionCheck, courseCont.updateCousrse);
courseRouter.delete("/deleteCourse", session.instructorSessionCheck, courseCont.deleteCourse);
courseRouter.get('/getAllCourses', session.sessionCheck, courseCont.getAllCourse);
courseRouter.get("/getCourse", session.sessionCheck, courseCont.getCourseByTittle);
courseRouter.get('/getUserCourses', session.sessionCheck, courseCont.getCourseOfUser);
courseRouter.post("/enrollCourse", session.sessionCheck, courseCont.enrollCourse);
courseRouter.post('/coursePayment', courseCont.coursePayment);

courseRouter.get('/render', courseCont.renderBuyPage);
courseRouter.post('/payment', courseCont.payment);

courseRouter.get("/getProgress", session.sessionCheck, courseCont.getProgress);
courseRouter.get("/getCertificate", session.sessionCheck, courseCont.getCertificate);

export default courseRouter;