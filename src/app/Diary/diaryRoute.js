import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { uploadImage } from '../../../config/imageUploader';
import { wrapAsync } from '../../../config/errorHandler';
import {
    getDiaryList,
    getDiaryListAll,
    getDiaryDetail,
    deleteDiary,
    postDiary,
    putDiary,
    postDiaryImage,
    ModifyStatus,
    getHomeList,
    postDiaryReport
} from './diaryController';

const diaryRouter = express.Router();



diaryRouter.get('/list', jwtMiddleware, wrapAsync(getDiaryListAll));
diaryRouter.get('/home', jwtMiddleware, wrapAsync(getHomeList));
diaryRouter.get('/:diary_id', jwtMiddleware, wrapAsync(getDiaryDetail));
diaryRouter.get('/list/mydiary', jwtMiddleware, wrapAsync(getDiaryList));
diaryRouter.delete('/:diary_id', jwtMiddleware, wrapAsync(deleteDiary));
diaryRouter.post('/', jwtMiddleware, wrapAsync(postDiary));
diaryRouter.put('/', jwtMiddleware, wrapAsync(putDiary));
diaryRouter.post(
  '/image',
  jwtMiddleware,
  uploadImage.array('image', 10),
  wrapAsync(postDiaryImage)
);
diaryRouter.post('/status', jwtMiddleware, wrapAsync(ModifyStatus));
diaryRouter.post('/report', jwtMiddleware, postDiaryReport);


export default diaryRouter;
