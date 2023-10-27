import express from 'express'
import { session } from '../middleware/auth';
import { assignmentCont } from '../controllers/assignment.Controller';
import { validate } from '../middleware/validate';
const assignmentRouter = express.Router();

assignmentRouter.post("/createAssignment", validate.validateCreateAssignment, session.instructorSessionCheck, assignmentCont.createCourseAssignment);
assignmentRouter.put("/updateAssignment", session.instructorSessionCheck, assignmentCont.updateAssignment);
assignmentRouter.delete("/deleteAssignment", session.instructorSessionCheck, assignmentCont.deleteAssignment);
assignmentRouter.get('/getAllAssignment', session.instructorSessionCheck, assignmentCont.getAllAssignment);
assignmentRouter.get("/getAssignment", session.instructorSessionCheck, assignmentCont.getAssignment);
assignmentRouter.get('/getAssignmentByStudent', session.sessionCheck, assignmentCont.getAssignmentByStud);
assignmentRouter.post("/submitAssignment", validate.validateSubmitAssignment, session.sessionCheck, assignmentCont.submitAssignment);

export default assignmentRouter;