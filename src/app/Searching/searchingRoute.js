import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import {
  getDiarySearch,
  getUserSearch,
  getDiaryHistory,
} from './searchingController';

const searchingRouter = express.Router();

searchingRouter.get('/word', jwtMiddleware, getDiarySearch);
searchingRouter.get('/user', jwtMiddleware, getUserSearch);
searchingRouter.get('/word/list', jwtMiddleware, getDiaryHistory);

export default searchingRouter;
