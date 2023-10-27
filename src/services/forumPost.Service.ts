import { ForumPost } from "../models/fourmPost.Model";
import { Enrollment } from "../models/enrollement.Model";
import { Course } from "../models/course.Model";
import { constants } from "../constants";

export class forumPostService {

    static createForumPost = async (userId, postdata) => {
        try {
          const courseUser = await Enrollment.findOne({
            courseId: postdata.courseId,
            userId: userId,
            payment: true
          });
      
          if (courseUser) {
            const newForumPost = new ForumPost({
              courseId: postdata.courseId,
              userId: userId,
              text: postdata.text
            });
      
            const savedForumPost = await newForumPost.save();
            return { success: true, forumPost: savedForumPost };
          } else {
            return { success: false };
          }
        } catch (error) {
          console.error(error);
          throw new Error(constants.errorMsgs.errorPost);
        }
      };

    static getUserForumPostsByCourse = async (userId, courseId, page, perPageData) => {
    try {
      const userForumPosts = await ForumPost.find({ userId: userId, courseId: courseId }).skip((page-1)*perPageData).limit(perPageData);
      const totalCount = await userForumPosts.countDocuments();
      const totalPages = Math.ceil(totalCount / perPageData); 
      if (userForumPosts) {
        return {success : true, posts : userForumPosts, totalPages};
      } else {
        return {success: false}
      }
    } catch (error) {
        console.error(error);
        throw new Error(constants.errorMsgs.errorPost);
    }
    };


    static getUserForumPostById = async (userId, forumPostId) => {
        try {
        const userForumPost = await ForumPost.findOne({ _id: forumPostId, userId: userId });
        return userForumPost;
        } catch (error) {
        console.error(error);
        throw new Error(constants.errorMsgs.errorPost);
        }
    };


    static updateForumPost = async (userId, postId, updatedText) => {
        try {
        const forumPost = await ForumPost.findOne({ $and: { _id: postId, userId: userId } });
        if (!forumPost) {
            return null;
        }
        forumPost.text = updatedText;
        const updatedPost = await forumPost.save();
        return updatedPost;
        } catch (error) {
        console.error(error);
        throw new Error(constants.errorMsgs.errorPost);
        }
    };


    static deleteForumPost = async (userId, postId) => {
        try {
        const forumPost = await ForumPost.findOne({ $and: { _id: postId, userId: userId } });
        if (!forumPost) {
            return null;
        }
        await forumPost.remove();
        return forumPost;
        } catch (error) {
        console.error(error);
        throw new Error(constants.errorMsgs.errorPost);
        }
    };

    static updateForumPostWithReplies = async (userId, postId, text) => {
        try {
          const forumPost = await ForumPost.findById(postId);
          if (!forumPost) {
            return null;
          }
          const courseInst = await Course.findOne({ $and: { _id: forumPost.courseId, instructorId: userId } });
          const courseUser = await Enrollment.findOne({ $and: { _id: forumPost.courseId, userId: userId } });      
          if (courseInst || courseUser) {
            forumPost.replies.push({
              userId,
              text
            });
            const updatedForumPost = await forumPost.save();
            return updatedForumPost;
          } else {
            return null;
          }
        } catch (error) {
          console.error(error);
          throw new Error(constants.errorMsgs.errorPost);
        }
      };

}