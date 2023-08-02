import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import {
  getDiarySearch,
  getUserSearch,
  getDiaryHistory,
  getUserHistory,
  deleteHistory,
} from './searchingController';

const searchingRouter = express.Router();

searchingRouter.get('/word', jwtMiddleware, getDiarySearch);
searchingRouter.get('/user', jwtMiddleware, getUserSearch);
searchingRouter.get('/word/list', jwtMiddleware, getDiaryHistory);
searchingRouter.get('/user/list', jwtMiddleware, getUserHistory);
searchingRouter.delete('/delete', jwtMiddleware, deleteHistory);

export default searchingRouter;
