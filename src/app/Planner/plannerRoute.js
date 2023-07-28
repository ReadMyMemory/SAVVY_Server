import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import {
  getPlannerListAll,
  getPlannerList,
  getPlannerListScrap,
  deletePlanner,
  postPlanner,
  getPlannerSearch,
  putPlanner,
  getPlannerdetail,
  postPlannerUpload,
  postScrap,
  postPlannerReport,
} from './plannerController';

const plannerRouter = express.Router();

plannerRouter.get('/list', jwtMiddleware, getPlannerListAll);
plannerRouter.get('/list/myplanner', jwtMiddleware, getPlannerList);
plannerRouter.get('/list/scrap', jwtMiddleware, getPlannerListScrap);
plannerRouter.delete('/', jwtMiddleware, deletePlanner);
plannerRouter.post('/', jwtMiddleware, postPlanner);
plannerRouter.get('/search', jwtMiddleware, getPlannerSearch);
plannerRouter.put('/', jwtMiddleware, putPlanner);
plannerRouter.get('/:planner_id', jwtMiddleware, getPlannerdetail);
plannerRouter.post('/upload', jwtMiddleware, postPlannerUpload);
plannerRouter.post('/scrap', jwtMiddleware, postScrap);
plannerRouter.post('/report', jwtMiddleware, postPlannerReport);

export default plannerRouter;
