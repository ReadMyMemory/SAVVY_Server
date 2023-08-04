import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { wrapAsync } from '../../../config/errorHandler';
import {
  getDiarySearch,
  getUserSearch,
  getDiaryHistory,
  getUserHistory,
  deleteHistory,
  deleteHistoryAll,
} from './searchingController';

const searchingRouter = express.Router();

searchingRouter.get('/word', jwtMiddleware, wrapAsync(getDiarySearch));
searchingRouter.get('/user', jwtMiddleware, wrapAsync(getUserSearch));
searchingRouter.get('/word/list', jwtMiddleware, wrapAsync(getDiaryHistory));
searchingRouter.get('/user/list', jwtMiddleware, wrapAsync(getUserHistory));
searchingRouter.delete('/delete', jwtMiddleware, wrapAsync(deleteHistory));
searchingRouter.delete(
  '/delete/all/:type',
  jwtMiddleware,
  wrapAsync(deleteHistoryAll)
);

export default searchingRouter;
