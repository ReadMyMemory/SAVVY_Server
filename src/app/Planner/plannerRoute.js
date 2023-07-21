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

plannerRouter.get('/list/:user_id', jwtMiddleware, getPlannerListAll);
plannerRouter.get('/list/myplanner/:user_id', jwtMiddleware, getPlannerList);
plannerRouter.get('/list/scrap/:user_id', jwtMiddleware, getPlannerListScrap);
plannerRouter.delete('/', jwtMiddleware, deletePlanner);
plannerRouter.post('/', jwtMiddleware, postPlanner);
plannerRouter.get('/search', jwtMiddleware, getPlannerSearch);

export default plannerRouter;
