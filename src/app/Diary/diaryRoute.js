import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { uploadImage } from '../../../config/imageUploader';
import {
    getDiaryList,
    getDiaryListAll,
    getDiaryDetail,
    deleteDiary,
    postDiary,
    putDiary,
    postDiaryImage,
    ModifyStatus
} from "./diaryController";


const diaryRouter = express.Router();

diaryRouter.get('/list', jwtMiddleware, getDiaryListAll);
diaryRouter.get('/:diary_id', jwtMiddleware, getDiaryDetail);
diaryRouter.get('/list/mydiary', jwtMiddleware, getDiaryList);
diaryRouter.delete('/:diary_id', jwtMiddleware, deleteDiary);
diaryRouter.post('/', jwtMiddleware, postDiary);
diaryRouter.put('/', jwtMiddleware, putDiary);
diaryRouter.post('/image',
    jwtMiddleware,
    uploadImage.array('image', 10),
    postDiaryImage
);
diaryRouter.post('/status', jwtMiddleware, ModifyStatus);


export default diaryRouter;