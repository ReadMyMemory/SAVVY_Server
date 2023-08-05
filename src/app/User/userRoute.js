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
import { wrapAsync } from '../../../config/errorHandler';

const userRouter = express.Router();

userRouter.post('/login', wrapAsync(loginUser));
userRouter.post('/signup', wrapAsync(postUser));
userRouter.get('/login', jwtMiddleware, wrapAsync(loginTest));
userRouter.post(
  '/image/profile',
  uploadImage.single('image'),
  wrapAsync(postProfileImage)
);
userRouter.get('/push/:user_alarmed', jwtMiddleware, wrapAsync(alarmTest));
userRouter.get(
  '/error',
  jwtMiddleware,
  wrapAsync(async (req, res) => {
    throw new Error('에러');
  })
);

export default userRouter;
