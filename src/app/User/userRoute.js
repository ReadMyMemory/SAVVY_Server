import express from 'express';
import { getTest } from './userController';

const userRouter = express.Router();

// 0. 테스트 API
userRouter.get('/test', getTest);

export default userRouter;
