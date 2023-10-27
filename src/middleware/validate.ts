import { joiSchema } from './joiSchema';

export class validate{

  static validateUserSignup =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.userSignupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };

  static validateUserLogin =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.userLoginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    }
    next();
  };

  static validateUpdateUser =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.userSignupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };

  static validateResetPassword =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };

  static validateCreateCourse =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.createCourseSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  static validateCreateQuiz =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.createQuizSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  static validateSubmitQuiz =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.submitQuizSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  static validateCreateAssignment =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.createAssignmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  static validateSubmitAssignment =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.submitAssignmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  static validateCreateForumPost =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.createForumPostSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  static validateUpdateForumPost =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.updateForumPostSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };  

  static validateReplies =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.RepliesSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  static validateCreateReview =async (req:any, res:any, next:any) =>{
    const { error } = joiSchema.createReviewSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

}













// import { joiSchema } from './joiSchema';

// export class validate {

//   static schemaMap = {
//     validateUserSignup: joiSchema.userSignupSchema,
//     validateUserLogin: joiSchema.userLoginSchema,
//     validateUpdateUser: joiSchema.userSignupSchema,
//     validateResetPassword: joiSchema.resetPasswordSchema,
//     validateCreateCourse: joiSchema.createCourseSchema,
//     validateCreateQuiz: joiSchema.createQuizSchema,
//     validateSubmitQuiz: joiSchema.submitQuizSchema,
//     validateCreateAssignment: joiSchema.createAssignmentSchema,
//     validateSubmitAssignment: joiSchema.submitAssignmentSchema,
//     validateCreateForumPost: joiSchema.createForumPostSchema,
//     validateUpdateForumPost: joiSchema.updateForumPostSchema,
//     validateReplies: joiSchema.RepliesSchema,
//     validateCreateReview: joiSchema.createReviewSchema,
//   };

//   static validateRequest = (req, res, next, schema) => {
//     const { error } = schema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }
//     next();
//   };

//   static validate = (req, res, next) => {
//     const { routeName } = req;

//     switch (routeName) {
//       case 'validateUserSignup':
//       case 'validateUserLogin':
//       case 'validateUpdateUser':
//       case 'validateResetPassword':
//       case 'validateCreateCourse':
//       case 'validateCreateQuiz':
//       case 'validateSubmitQuiz':
//       case 'validateCreateAssignment':
//       case 'validateSubmitAssignment':
//       case 'validateCreateForumPost':
//       case 'validateUpdateForumPost':
//       case 'validateReplies':
//       case 'validateCreateReview':
//         validate.validateRequest(req, res, next, validate.schemaMap[routeName]);
//         break;
//       default:
//         // Handle the case where there's no schema defined for the route.
//         res.status(500).json({ message: 'Route schema not found' });
//     }
//   };
// }