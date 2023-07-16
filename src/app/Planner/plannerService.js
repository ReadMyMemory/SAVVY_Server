import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import {
  plannerIdCheck,
  scrapIdCheck,
  userIdCheck,
  retrievePlannerId,
} from './plannerProvider';
import {
  deletePlannerbyId,
  deleteScrapbyId,
  insertPlanner,
  insertTimetable,
} from './plannerDao';

export const deletePlannerCheck = async (user_id, planner_id, type) => {
  // 삭제하려는 유저가 여행계획서 소유자인지 판별
  // 본인꺼 삭제하는지, 스크랩한거 삭제하는지
  // type === 0 : 나의 계획서 / 1 : 스크랩
  // user가 존재하는지 체크
  const plannerOwner = await userIdCheck(user_id);
  if (!plannerOwner[0][0]) {
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  }
  if (type === '0') {
    const myPlannerCheck = await plannerIdCheck(planner_id);
    // planner가 존재하는지 체크
    if (!myPlannerCheck[0][0]) {
      return errResponse(baseResponse.PLANNER_PLANNERID_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    const deletePlannerbyIdResult = deletePlannerbyId(connection, planner_id);

    connection.release();
    return response(baseResponse.SUCCESS, deletePlannerbyIdResult[0]);
  } else {
    const myScrapCheck = await scrapIdCheck(user_id, planner_id);
    // planner가 존재하는지 체크
    if (!myScrapCheck[0][0]) {
      return errResponse(baseResponse.PLANNER_SCRAP_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteScrapbyIdResult = deleteScrapbyId(connection, [
      user_id,
      planner_id,
    ]);

    connection.release();
    return response(baseResponse.SUCCESS, deleteScrapbyIdResult[0]);
  }
};

export const createPlanner = async (defaultInfo, timetableInfo) => {
  // user가 존재하는지 체크
  const userExist = await userIdCheck(defaultInfo.user_id);
  if (!userExist[0][0]) {
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  }
  const connection = await pool.getConnection(async (conn) => conn);
  const insertPlannerResult = insertPlanner(connection, [
    defaultInfo.title,
    defaultInfo.user_id,
    defaultInfo.memo,
  ]);
  const plannerId = await retrievePlannerId(defaultInfo.user_id);
  // planner 생성중 에러 검증
  if (!plannerId[0][0]) {
    return errResponse(baseResponse.PLANNER_PLANNERID_NOT_EXIST);
  }
  // 시간표 저장
  for (let i = 0; i < timetableInfo.length; i++) {
    await insertTimetable(connection, [
      plannerId,
      timetableInfo[i].place_name,
      timetableInfo[i].date,
      timetableInfo[i].started_at,
      timetableInfo[i].finished_at,
    ]);
    // 시간표 id
    // 체크리스트 저장
  }
  connection.release();
  return response(baseResponse.SUCCESS, insertPlannerResult[0]);
};
