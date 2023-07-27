import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import {
    getDiaryList,
    getDiaryListAll,
    deleteDiary,
    postDiary,
    putDiary
} from "./diaryController";


const diaryRouter = express.Router();

diaryRouter.get('/list', jwtMiddleware, getDiaryListAll);
diaryRouter.get('/list/mydiary', jwtMiddleware, getDiaryList);
diaryRouter.delete('/:diary_id', jwtMiddleware, deleteDiary);
diaryRouter.post('/', jwtMiddleware, postDiary);
diaryRouter.put('/', jwtMiddleware, putDiary);
export default diaryRouter;