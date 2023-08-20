import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { wrapAsync } from '../../../config/errorHandler';
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
  putChecklist,
  deleteUpload,
} from './plannerController';

const plannerRouter = express.Router();

plannerRouter.get('/list', jwtMiddleware, wrapAsync(getPlannerListAll));
plannerRouter.get('/list/myplanner', jwtMiddleware, wrapAsync(getPlannerList));
plannerRouter.get('/list/scrap', jwtMiddleware, wrapAsync(getPlannerListScrap));
plannerRouter.delete('/', jwtMiddleware, wrapAsync(deletePlanner));
plannerRouter.post('/', jwtMiddleware, wrapAsync(postPlanner));
plannerRouter.get('/search', jwtMiddleware, wrapAsync(getPlannerSearch));
plannerRouter.put('/', jwtMiddleware, wrapAsync(putPlanner));
plannerRouter.get('/:planner_id', jwtMiddleware, wrapAsync(getPlannerdetail));
plannerRouter.post('/upload', jwtMiddleware, wrapAsync(postPlannerUpload));
plannerRouter.post('/scrap', jwtMiddleware, wrapAsync(postScrap));
plannerRouter.post('/report', jwtMiddleware, wrapAsync(postPlannerReport));
plannerRouter.put('/checklist', jwtMiddleware, wrapAsync(putChecklist));
plannerRouter.delete('/upload', jwtMiddleware, wrapAsync(deleteUpload));

export default plannerRouter;
