import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { getDiarySearch } from './searchingController';

const searchingRouter = express.Router();

searchingRouter.get('/word', jwtMiddleware, getDiarySearch);

export default searchingRouter;
