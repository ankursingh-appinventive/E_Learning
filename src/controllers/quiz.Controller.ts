import { quizService } from '../services/quiz.Service';
import { constants } from '../constants';

export class quizCont{

    // CREATE COURSE QUIZ
    static createCourseQuiz =async (req:any, res:any, next:any) =>{
        try {
            const uid = req.userId;
            const quizData = req.body;
            const createdQuiz = await quizService.createCourseQuiz(uid, quizData);
            if(createdQuiz.success){
              res.status(201).json({message: constants.successMags.qzCreated,createdQuiz});
            }else if(createdQuiz.notAllowed){
              res.status(400).json({message : constants.warningMsgs.notAllowed});
            }else{
              res.status(404).json({message: constants.errorMsgs.crsError})
            }
          } catch (error) {
            res.status(500).json({ message : constants.errorMsgs.error });
          }
    }

    // UPDATE COURSE QUIZ
    static updateCourseQuiz = async (req:any, res:any, next:any) =>{
        try {
            const uid = req.userId;
            const quizData = req.body;
            const updateQuiz = await quizService.updateCourseQuiz(uid, quizData);
            if (updateQuiz.success) {
              res.status(200).json(updateQuiz);
            } else if(updateQuiz.notAllowed){
              res.status(400).json({message : constants.warningMsgs.notAllowed});
            }else{
              res.status(404).json({ message : constants.errorMsgs.quizEror });
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({ message : constants.errorMsgs.error });
          }
    }

    // DELETE COURSE QUIZ
    static deleteCourseQuiz = async (req:any, res:any, next:any) =>{
        try {
            const uid = req.userId;
            const quizID = req.query.id;
            const deleteResult = await quizService.deleteCourseQuiz(uid, quizID);
        
            if (deleteResult.success) {
              res.status(200).json({ message : constants.successMags.success, deletedQuiz: deleteResult.deletedQuiz });
            } else{
              res.status(404).json({ message : constants.errorMsgs.quizEror });
            }
          } catch (error) {
            res.status(500).json({ message : constants.errorMsgs.error });
          }
    }

    // GET ALL COURSE QUIZ
    static getAllCourseQuiz = async(req:any, res:any) =>{
        try {
          const page:number = +(req.query.page || "1");
          const perPageData:number = +(req.query.limit || "10");
          const uid = req.userId;
          const courseID = req.query.id;
          const quizzes = await quizService.getAllCourseQuiz(uid, courseID, page, perPageData);
          if (quizzes.success) {
            res.status(200).json({totalPages:quizzes.totalPages, message:constants.successMags.success, quizzes: quizzes.quiz });
          } else {
            res.status(404).json({message : constants.errorMsgs.quizEror});
          }
        } catch (error) {
          console.error(error.message);
          res.status(500).json({ message : constants.errorMsgs.error });
        }
    }

    // GET  COURSE QUIZ BY INSTRUCTOR
    static getCourseQuizByInstructor = async(req:any, res:any) =>{
        try {
            const uid = req.userId;
            const quizID = req.query.id;
            const quiz = await quizService.getCourseQuizByInstructor(uid, quizID);
            if (quiz) {
              res.status(200).json({message : constants.successMags.success, quiz});
            } else {
              res.status(404).json({message : constants.errorMsgs.quizEror});
            }
          } catch (error) {
            console.error(error.message);
            res.status(500).json({ message : constants.errorMsgs.error });
          }
    }

    // GET  COURSE QUIZ BY STUDENT
    static getCourseQuizByStud = async(req:any, res:any) =>{
        try {
            const uid = req.userId;
            const quizId = req.query.id;
            const quiz = await quizService.getCourseQuizByStud(uid, quizId);
            if (quiz.success) {
              res.status(200).json(quiz);
            }else if(quiz.notEnrolled){
              res.status(400).json({ message:constants.warningMsgs.notEnrolled });
            } else {
              res.status(404).json({ message : constants.errorMsgs.quizEror });
            }
          } catch (error) {
            console.error(error.message);
            res.status(500).json({ message : constants.errorMsgs.error });
          }
    }

    // SUBMIT COURSE QUIZ BY STUDENT
    static submitQuizByStud = async(req:any, res:any) =>{
        try {
            const uid = req.userId;
            const { quizId, submittedIndex } = req.body;
            const result = await quizService.submitQuizByStud(uid, quizId, submittedIndex);
            if(result.success){
              res.status(200).json(result);
            }else if(result.notEnrolled){
              res.status(400).json({ message:constants.warningMsgs.notEnrolled });
            }else{
              res.status(404).json({ message : constants.errorMsgs.quizEror });
            }
          } catch (error) {
            console.error(error.message);
            res.status(500).json({ message : constants.errorMsgs.error });
          }
    }
    
}
