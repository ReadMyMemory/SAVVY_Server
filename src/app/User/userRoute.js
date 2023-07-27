import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { loginUser, postUser, loginTest } from './userController';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/signup', postUser);
userRouter.get('/login', jwtMiddleware, loginTest);

export default userRouter;
