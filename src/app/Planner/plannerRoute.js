import express from 'express';
import {
  getPlannerListAll,
  getPlannerList,
  getPlannerListScrap,
  deletePlanner,
  postPlanner,
  getPlannerSearch,
} from './plannerController';

const plannerRouter = express.Router();

plannerRouter.get('/list/:user_id', getPlannerListAll);
plannerRouter.get('/list/myplanner/:user_id', getPlannerList);
plannerRouter.get('/list/scrap/:user_id', getPlannerListScrap);
plannerRouter.delete('/', deletePlanner);
plannerRouter.post('/', postPlanner);
plannerRouter.get('/:search_word', getPlannerSearch);

export default plannerRouter;
