import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { getDiarySearch, getUserSearch } from './searchingController';

const searchingRouter = express.Router();

searchingRouter.get('/word', jwtMiddleware, getDiarySearch);
searchingRouter.get('/user', jwtMiddleware, getUserSearch);

export default searchingRouter;
