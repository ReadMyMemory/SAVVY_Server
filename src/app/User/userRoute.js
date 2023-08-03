import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { uploadImage } from '../../../config/imageUploader';
import {
  loginUser,
  postUser,
  loginTest,
  postProfileImage,
  alarmTest,
} from './userController';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/signup', postUser);
userRouter.get('/login', jwtMiddleware, loginTest);
userRouter.post(
  '/image/profile',
  uploadImage.single('image'),
  postProfileImage
);
userRouter.get('/push/:user_alarmed', jwtMiddleware, alarmTest);

export default userRouter;
