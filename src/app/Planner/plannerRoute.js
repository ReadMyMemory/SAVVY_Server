import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import {
  getPlannerListAll,
  getPlannerList,
  getPlannerListScrap,
  deletePlanner,
  postPlanner,
  getPlannerSearch,
} from './plannerController';

const plannerRouter = express.Router();

plannerRouter.get('/list', jwtMiddleware, getPlannerListAll);
plannerRouter.get('/list/myplanner', jwtMiddleware, getPlannerList);
plannerRouter.get('/list/scrap', jwtMiddleware, getPlannerListScrap);
plannerRouter.delete('/', jwtMiddleware, deletePlanner);
plannerRouter.post('/', jwtMiddleware, postPlanner);
plannerRouter.get('/search', jwtMiddleware, getPlannerSearch);

export default plannerRouter;
