import express from 'express';
import { loginUser, postUser } from './userController';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/signup', postUser);

export default userRouter;
