import express from 'express';
import {
    getDiaryList,
    getDiaryListAll,
    deleteDiary,
    postDiary
} from "./diaryController";


const diaryRouter = express.Router();

diaryRouter.get('/list/:user_id', getDiaryListAll);
diaryRouter.get('/list/mydiary/:user_id', getDiaryList);
export default diaryRouter;