import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { uploadImage } from '../../../config/imageUploader';
import {
  loginUser,
  postUser,
  loginTest,
  postProfileImage,
} from './userController';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/signup', postUser);
userRouter.get('/login', jwtMiddleware, loginTest);
userRouter.post(
  '/image/profile',
  jwtMiddleware,
  uploadImage.single('image'),
  postProfileImage
);

export default userRouter;
