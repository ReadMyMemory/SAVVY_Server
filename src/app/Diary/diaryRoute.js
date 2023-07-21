import express from 'express';
import {
    getDiaryListAll
} from "./diaryController";


const diaryRouter = express.Router();

diaryRouter.get('/list/:user_id', getDiaryListAll);

export default diaryRouter;