import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import { selectUserbyId } from '../User/userDao';
import baseResponse from '../../../config/baseResponseStatus';
import {
  selectPlannerListById,
  selectPlannerbyId,
  selectScrapbyId,
  selectPlannerId,
  selectTimetableId,
  selectPlannerSearch,
} from './plannerDao';

export const userIdCheck = async (user_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdCheckResult = selectUserbyId(connection, user_id);

  connection.release();
  return userIdCheckResult;
};

export const plannerIdCheck = async (planner_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const plannerIdCheckResult = selectPlannerbyId(connection, planner_id);

  connection.release();
  return plannerIdCheckResult;
};

export const scrapIdCheck = async (user_id, planner_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const scrapIdCheckResult = selectScrapbyId(connection, [user_id, planner_id]);

  connection.release();
  return scrapIdCheckResult;
};

export const retrievePlannerList = async (user_id, type) => {
  // user_id 존재 체크
  const plannerOwner = await userIdCheck(user_id);
  if (!plannerOwner[0][0]) {
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const retrievePlannerListResult = await selectPlannerListById(
    connection,
    user_id,
    type
  );

  connection.release();
  if (retrievePlannerListResult[0][0]) {
    return response(baseResponse.SUCCESS, retrievePlannerListResult[0]);
  } else {
    return errResponse(baseResponse.PLANNER_PLANNERID_NOT_EXIST);
  }
};

export const retrievePlannerId = async (user_id) => {
  // 방금 만든 planner의 id를 받아오기 위함
  const plannerOwner = await userIdCheck(user_id);
  if (!plannerOwner[0][0]) {
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const retrievePlannerIdResult = await selectPlannerId(connection, user_id);

  connection.release();
  return retrievePlannerIdResult;
};

export const retrieveTimetableId = async (planner_id, date, start, finish) => {
  // 방금 만든 timetable의 id를 받아오기 위함
  const timetableOwner = await plannerIdCheck(planner_id);
  if (!timetableOwner[0][0]) {
    return errResponse(baseResponse.PLANNER_PLANNERID_NOT_EXIST);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveTimetableIdResult = await selectTimetableId(connection, [
    planner_id,
    date,
    start,
    finish,
  ]);

  connection.release();
  return retrieveTimetableIdResult;
};

export const retrievePlannerSearch = async (user_id, search_word) => {
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  const retrievePlannerSearchResult = await selectPlannerSearch(connection, [
    user_id,
    search_word,
  ]);
  connection.release();
  if (!retrievePlannerSearchResult[0][0])
    return errResponse(baseResponse.PLANNER_PLANNERID_NOT_EXIST);
  return response(baseResponse.SUCCESS, retrievePlannerSearchResult[0]);
};
