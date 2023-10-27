import express from 'express'
import { session } from '../middleware/auth';
import { quizCont } from '../controllers/quiz.Controller';
import { validate } from '../middleware/validate';
const quizRouter = express.Router();

quizRouter.post("/createCourseQuiz", validate.validateCreateQuiz, session.instructorSessionCheck, quizCont.createCourseQuiz);
quizRouter.put("/updateCourseQuiz", session.instructorSessionCheck, quizCont.updateCourseQuiz);
quizRouter.delete("/deleteCourseQuiz", session.instructorSessionCheck, quizCont.deleteCourseQuiz);
quizRouter.get('/getAllCourseQuiz', session.instructorSessionCheck, quizCont.getAllCourseQuiz);
quizRouter.get("/getCourseQuizByInstructor", session.instructorSessionCheck, quizCont.getCourseQuizByInstructor);
quizRouter.post('/getCourseQuizByStudent', session.sessionCheck, quizCont.getCourseQuizByStud);
quizRouter.post('/submitQuiz', validate.validateSubmitQuiz, session.sessionCheck, quizCont.submitQuizByStud);

export default quizRouter;