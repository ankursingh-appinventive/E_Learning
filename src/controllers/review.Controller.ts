import {reviewService} from '../services/review.Service'
import { constants } from '../constants';


export class reviewController {

    static createReview = async (req, res) => {
        const uid = req.userId;
        try {
            const { courseId, rating, comment } = req.body;
            const result = await reviewService.createReview(uid, courseId, rating, comment);
            res.status(result.status).json({ message: result.message });
        } catch (error) {
            res.status(500).json({ message: constants.errorMsgs.error });
        }
    };

    static getReview = async (req, res) => {
        try {
            const page:number = +(req.query.page || "1");
            const perPageData:number = +(req.query.limit || "10");
            const courseId = req.query.courseId;
            const reviews = await reviewService.getReview(courseId, page, perPageData);
            if (reviews.success) {
                res.status(200).json({totalPages: reviews.totalPages, reviews: reviews.review });
            } else {
                res.status(404).json({message: constants.errorMsgs.reviewError});
            }
        } catch (error) {
            res.status(500).json({ message: constants.errorMsgs.error });
        }
    }

    static updateReview = async (req, res) => {
        const uid = req.userId;
        try {
            const { reviewId, rating, comment } = req.body;

            const result = await reviewService.updateReview(reviewId, uid, rating, comment);
            res.status(result.status).json({ message: result.message });
            } catch (error) {
            res.status(500).json({ message: constants.errorMsgs.error });
            }
    }

    static deleteReview = async (req, res) => {
        try {
            const userId = req.user.id;
            const reviewId = req.query.reviewId;
        
            const result = await reviewService.deleteReview(reviewId, userId);
            res.status(result.status).json({ message: result.message });
            } catch (error) {
                res.status(500).json({ message: constants.errorMsgs.error });
            }
    }
}