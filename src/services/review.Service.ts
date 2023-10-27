import {Review} from '../models/review.Model'
import { Enrollment } from '../models/enrollement.Model';
import { constants } from '../constants';

export class reviewService {

    static createReview = async (userId, courseId, rating, comment) => {
        try {
            const enrollment = await Enrollment.findOne({ courseId, userId, payment: true });
            if (!enrollment) {
                return { status: 403, message: constants.warningMsgs.notEnrolled };
            }
            const review = new Review({
                courseId,
                userId: userId,
                rating,
                comment,
            });
            await review.save();
            return { status: 201, message: constants.successMags.success };
        } catch (error) {
            return { status: 500, message: constants.errorMsgs.error };
        }
    };

    static getReview = async (courseId, page, perPageData) => {
        try { 
            const reviews = await Review.find({ course: courseId }).skip((page-1)*perPageData).limit(perPageData);
            const totalCount = await reviews.countDocuments();
            const totalPages = Math.ceil(totalCount / perPageData); 
            if (reviews) {
              return {success : true, review : reviews, totalPages};
            } else {
              return {success: false}
            }
          } catch (error) {
            return { status: 500, message: constants.errorMsgs.error };
          }
    }

    static updateReview = async (reviewId, studentId, rating, comment) => {
        try {
            const review = await Review.findById(reviewId);
            if (!review) {
              return { status: 404, message: constants.errorMsgs.reviewError };
            }
            if (review.student.toString() !== studentId) {
              return { status: 403, message: constants.warningMsgs.notPermission };
            }
            review.rating = rating;
            review.comment = comment;
            await review.save();
            return { status: 200, message: constants.successMags.success };
          } catch (error) {
            return { status: 500, message: constants.errorMsgs.error };
          }
    }

    static deleteReview = async (reviewId, userId) => {
        try {
          const review = await Review.findById(reviewId);
          if (!review) {
            return { status: 404, message: constants.errorMsgs.reviewError };
          }
          if (review.student.toString() !== userId) {
            return { status: 403, message: constants.warningMsgs.notPermission };
          }
          await review.remove();
          return { status: 200, message: constants.successMags.success };
        } catch (error) {
          return { status: 500, message: constants.errorMsgs.error };
        }
    }

}