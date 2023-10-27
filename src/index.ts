import express from 'express';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import connectDatabase from './database/dbConfig'
// import UserRouter from './routers/userRoute';
import userRouter from './routers/user.Routes';
import courseRouter from './routers/course.Routes';
import assignmentRouter from './routers/assignment.Routes';
import forumRouter from './routers/fourmPost.Routes';
import quizRouter from './routers/quiz.Routes';
import reviewRouter from './routers/review.Routes';

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3030;

const app = express()
// const userRouter = new UserRouter().router;
app.use(express.json())
connectDatabase();

const swaggerJsDocs = YAML.load(path.join(process.cwd(), 'dist', 'swagger.yaml'));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs))
app.use('/home',userRouter);


app.use('/user', userRouter);
app.use('/course', courseRouter);
app.use('/assignment', assignmentRouter);
app.use('/quiz', quizRouter)
app.use('/forum', forumRouter);
app.use('/review', reviewRouter);

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})