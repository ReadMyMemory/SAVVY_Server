import express from 'express';
import { getTest, postUser } from './userController';

const userRouter = express.Router();

// 0. 테스트 API
userRouter.get('/test', getTest);

// 1. 회원가입
userRouter.post('/sign_up', postUser);

export default userRouter;
