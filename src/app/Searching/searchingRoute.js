import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import {
  getDiarySearch,
  getUserSearch,
  getDiaryHistory,
  getUserHistory,
} from './searchingController';

const searchingRouter = express.Router();

searchingRouter.get('/word', jwtMiddleware, getDiarySearch);
searchingRouter.get('/user', jwtMiddleware, getUserSearch);
searchingRouter.get('/word/list', jwtMiddleware, getDiaryHistory);
searchingRouter.get('/user/list', jwtMiddleware, getUserHistory);

export default searchingRouter;
