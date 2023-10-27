import express from 'express'
import { session } from '../middleware/auth';
import { forumPostCont } from '../controllers/fourmPost.Controller';
import { validate } from "../middleware/validate";
const forumRouter = express.Router();

forumRouter.post("/createForumPost", validate.validateCreateForumPost, session.sessionCheck, forumPostCont.createForumPost);
forumRouter.get("/getForumPostsByCourse", session.sessionCheck, forumPostCont.getUserForumPostsByCourse);
forumRouter.get("/getForumPostById", session.sessionCheck, forumPostCont.getUserForumPostById);
forumRouter.patch('/updateForumPost', validate.validateUpdateForumPost, session.sessionCheck, forumPostCont.updateForumPost);
forumRouter.delete("/deleteForumPost", session.sessionCheck, forumPostCont.deleteForumPost);
forumRouter.put('/ForumPostWithReplies', validate.validateReplies, session.sessionCheck, forumPostCont.updateForumPostWithReplies);

export default forumRouter;