import { Course } from '../models/course.Model';
import { Quiz } from "../models/quiz.Model";
import { Enrollment } from "../models/enrollement.Model";
import {ProgressModel} from "../models/progress.Model";
import { constants } from '../constants';

export class quizService {

    static createCourseQuiz = async (instructorId, quizData) => {
        try {
          const course = await Course.findOne({ _id: quizData.courseId, instructorId:instructorId});
          if (!course) {
            return { success: false };
          }
          if (course.instructorId !== instructorId) {
              return { success: false, notAllowed: true };
          }
            const newQuiz = new Quiz({
              courseId: quizData.courseId,
              instructorId: instructorId,
              questionNo: quizData.questionNo,
              question: quizData.question,
              options: quizData.options,
              correctOptionIndex: quizData.correctOptionIndex
            });      
            const result = await newQuiz.save();      
            const updatedCourse = await Course.findOneAndUpdate(
              { _id: quizData.courseId },
              { $push: { quizzes: result._id } },
              { new: true }
            );
            return {success:true, course: updatedCourse, quiz: result};
        } catch (error) {
          console.error(error);
          throw new Error(constants.errorMsgs.errorQuiz);
        }
    };

    static updateCourseQuiz = async (instructorId, quizData) => {
    try {
        const quiz = await Quiz.findOne({ _id: quizData.quizID });
        if (!quiz) {
          return { success: false };
        }
        if (quiz.instructorId !== instructorId) {
            return { success: false, notAllowed: true };
        }
        const updateQuiz = await Quiz.findOneAndUpdate(
            { _id: quizData.quizID },
            { $set: quizData },
            { new: true }
        );
        return {success:true, updateQuiz: updateQuiz};
    } catch (error) {
        console.error(error);
        throw new Error(constants.errorMsgs.errorQuiz);
    }
    };


    static deleteCourseQuiz = async (instructorId, quizID) => {
        try {
        const quizInst = await Quiz.findOne({ _id: quizID, instructorId });
        if (!quizInst) {
            return { success: false};
        }
        const deletedQuiz = await Quiz.findOneAndRemove({ _id: quizID });
        return { success: true, deletedQuiz };
        } catch (error) {
        console.error(error);
        throw new Error(constants.errorMsgs.errorQuiz);
        }
    };

    static getAllCourseQuiz = async (instructorId, courseID, page, perPageData) => {
        try {
          const findQuiz = await Quiz.find({ courseId: courseID, instructorId: instructorId }).skip((page-1)*perPageData).limit(perPageData);
          const totalCount = await findQuiz.countDocuments();
          const totalPages = Math.ceil(totalCount / perPageData);  
          if (findQuiz) {
            return {success : true, quiz : findQuiz, totalPages};
          } else {
            return {success: false}
          }
        } catch (error) {
          console.error(error);
          throw new Error(constants.errorMsgs.errorQuiz);
        }
    };

    static getCourseQuizByInstructor = async (instructorId, quizID) => {
        try {
          const findQuiz = await Quiz.findOne({ _id: quizID, instructorId: instructorId });
          return findQuiz;
        } catch (error) {
          console.error(error);
          throw new Error(constants.errorMsgs.errorQuiz);
        }
    };
    
    static getCourseQuizByStud = async (userId, quizId) => {
        try {
          const quiz = await Quiz.findOne({_id: quizId}).select('-correctOptionIndex');
          const enrollUser = await Enrollment.findOne({ courseId:quiz.courseId, userId, payment: true });
          if(!enrollUser){
            return { success: false , notEnrolled:true}
          }
          return { success: true , quiz};
        } catch (error) {
        console.error(error);
        throw new Error(constants.errorMsgs.errorQuiz);
        }
    };

    static submitQuizByStud = async (userId, quizId, submittedIndex) => {
        try {
          const quiz = await Quiz.findOne({_id: quizId})
          const enrollUser = await Enrollment.findOne({ courseId: quiz.courseId, userId, payment: true });
          if (enrollUser) {      
            if (!quiz) {
              return {success: false};
            }      
            const isAnswerCorrect = submittedIndex == quiz.correctOptionIndex;
            if (isAnswerCorrect) {
              const getProgress = await ProgressModel.findOne({ userId, courseId:quiz.courseId });
              const currsentScore = getProgress.score + 5;
              await ProgressModel.findOneAndUpdate(
                { userId, courseId:quiz.courseId },
                { $set: { score: currsentScore } },
                { new: true }
              );
            }
            return { success: true , isAnswerCorrect };
          } else {
            return { success: false , notEnrolled:true}
          }
        } catch (error) {
          console.error(error);
          throw new Error(constants.errorMsgs.errorQuiz);
        }
      };

}