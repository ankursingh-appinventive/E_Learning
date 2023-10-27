import { Course } from '../models/course.Model';
import { Assignment } from "../models/assignment.Model";
import { Enrollment } from "../models/enrollement.Model";
import { constants } from '../constants'
import {ProgressModel} from '../models/progress.Model';

export class assignmentService{

  static createCourseAssignment = async (userId, assignmentData) => {
      try {
          const course = await Course.findOne({ _id: assignmentData.courseId });
          if (!course) {
              return { success: false };
          }
          if (course.instructorId != userId) {
              return { success: false, notAllowed: true };
          }
          const newAssignment = new Assignment({
              courseId: assignmentData.courseId,
              instructorId: userId,
              questionNo: assignmentData.questionNo,
              description: assignmentData.description,
              correctAnswers: assignmentData.correctAnswers
          });
          const createdAssignment = await newAssignment.save();
          const updatedCourse = await Course.findOneAndUpdate(
              { _id: assignmentData.courseId },
              { $push: { assignments: createdAssignment._id } },
              { new: true }
          );
          return { success: true, updatedCourse: updatedCourse, createdAssignment: createdAssignment };
      } catch (error) {
          console.error(error.message);
          throw new Error(constants.errorMsgs.errorAss);
      }
  };
  
  static updateAssignment = async (userId, assignmentData) => {
      try {
      const corInst = await Assignment.findOne({_id: assignmentData.id, instructorId: userId });
      // const corInst = await Course.findOne({ _id: courseID });
      let updateAssignment;
      if (corInst) {
        updateAssignment = await Assignment.findOneAndUpdate(
          { _id: assignmentData.assignmentID },
          { $set: assignmentData },
          { new: true }
      );
      } else {
        return { success: false, notAllowed: true };
      }  
      if (!updateAssignment) {
          return { success: false, assignmentNotFound: true };
      }    
      return { success: true, updatedAssignment: updateAssignment };
      } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorAss);
      }
  };

  static deleteAssignment = async (userId, assignmentID) => {
      try {
      const assInst = await Assignment.findOne({_id: assignmentID, instructorId: userId });
      let deletedAssignment, updatedCourse;
      if (assInst) {
          deletedAssignment = await Assignment.findOneAndRemove({ _id: assignmentID });
          updatedCourse = await Course.findOneAndUpdate(
            { _id: assInst.courseId },
            { $pull: { assignments: assignmentID } },
            { new: true }
        );
      } else {
          return { success: false, notAllowed: true };
      }   
      if (!deletedAssignment) {
          return { success: false, assignmentNotFound: true };
      }
      return { success: true, updatedCourse: updatedCourse };
      } catch (error) {
      console.error(error.message);
      throw new Error(constants.errorMsgs.errorAss);
      }
  };

  static getAllAssignments = async (userId, courseID, page, perPageData) => {
      try {
        const findAssignment = await Assignment.find({ courseId: courseID, instructorId: userId }).skip((page-1)*perPageData).limit(perPageData);
        const totalCount = await findAssignment.countDocuments();
        const totalPages = Math.ceil(totalCount / perPageData);
        if (findAssignment && findAssignment.length > 0) {
          return { success: true, assignments: findAssignment, totalPages};
        } else {
          return { success: false};
        }
      } catch (error) {
        console.error(error.message);
        throw new Error(constants.errorMsgs.errorAss);
      }
  };

  static getAssignmentById = async (userId, assignmentID) => {
      try {
      const findAssignment = await Assignment.findOne({ _id: assignmentID, instructorId: userId });
      if (findAssignment) {
          return { success: true, assignment: findAssignment };
      } else {
          return { success: false, notAllowed: true };
      }
      } catch (error) {
      throw new Error(constants.errorMsgs.errorAss);
      }
  };

  static getAssignmentByStudent = async (userId, assignmentID) => {
      try {
        const assignment = await Assignment.findOne({ _id: assignmentID }).select('-correctAnswers');
        if (!assignment) {
          return { success: false };
        }
        const stud = await Enrollment.findOne({ userId: userId, courseId: assignment.courseId, payment: true });
        if (stud) {
          return { success: true, assignment: assignment };
        } else {
          return { success: false, notEnrolled: true };
        }
      } catch (error) {
        console.error(error.message);
        throw new Error(constants.errorMsgs.errorAss);
      }
  };

    static submitAssignment = async (userId, assignmentData) => {
      try {
        const assignment = await Assignment.findOne({ _id: assignmentData.id });
        if (!assignment) {
          return { success: false };
        }
        const stud = await Enrollment.findOne({ userId: userId, courseId: assignment.courseId, payment: true });
        if (stud) {
          if (assignment.correctAnswers.includes(assignmentData.answer)) {
            const getProgress = await ProgressModel.findOne({ userId, courseId: assignment.courseId });
            const currsentScore = getProgress.score + 5;
            await ProgressModel.findOneAndUpdate(
              { userId, courseId: assignment.courseId },
              { $set: { score: currsentScore } },
              { new: true }
            );
            return { success: true, submission: 'Answer is correct' };
          }else{
            return { success: true, submission: 'Answer is incorrect' };
          }
        } else {
          return { success: false, notEnrolled: true };
        }
      } catch (error) {
        console.error(error.message);
        throw new Error(constants.errorMsgs.errorAss);
      }
  };

}