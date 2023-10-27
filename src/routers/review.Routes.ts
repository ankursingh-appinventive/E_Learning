import express from 'express';
import { session } from '../middleware/auth';
import { reviewController } from '../controllers/review.Controller';
import { validate } from "../middleware/validate";
const reviewRouter = express.Router();

reviewRouter.post("/createReview", validate.validateCreateReview, session.sessionCheck, reviewController.createReview);
reviewRouter.get("/getReview", session.sessionCheck, reviewController.getReview);
reviewRouter.patch('/updateReview', validate.validateUpdateForumPost, session.sessionCheck, reviewController.updateReview);
reviewRouter.delete("/deleteReview", session.sessionCheck, reviewController.deleteReview);

export default reviewRouter;