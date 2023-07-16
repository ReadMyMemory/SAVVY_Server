import express from 'express';
import {
  getPlannerListAll,
  getPlannerList,
  getPlannerListScrap,
  deletePlanner,
  postPlanner,
} from './plannerController';

const plannerRouter = express.Router();

plannerRouter.get('/list/all/:user_id', getPlannerListAll);
plannerRouter.get('/list/:user_id', getPlannerList);
plannerRouter.get('/list/scrap/:user_id', getPlannerListScrap);
plannerRouter.delete('/', deletePlanner);
plannerRouter.post('/', postPlanner);

export default plannerRouter;
