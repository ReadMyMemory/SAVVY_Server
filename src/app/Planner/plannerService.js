import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import { userIdCheck } from '../User/userProvider';
import {
  plannerIdCheck,
  scrapIdCheck,
  // userIdCheck,
  retrievePlannerId,
  retrieveTimetableId,
  reportCheck,
} from './plannerProvider';
import {
  deletePlannerbyId,
  deleteScrapbyId,
  insertPlanner,
  insertTimetable,
  insertChecklist,
  updatePlanner,
  updateTimetable,
  updateChecklist,
  deleteTimetable,
  insertScrap,
  insertPlannerReport,
  insertUserBlock,
  updatePlannerReportCount,
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

export const createPlanner = async (defaultInfo, timetableInfo, type) => {
  // user가 존재하는지 체크
  const userExist = await userIdCheck(defaultInfo.user_id);
  if (!userExist[0][0]) {
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  }
  const connection = await pool.getConnection(async (conn) => conn);
  const plannerId = await insertPlanner(
    connection,
    [defaultInfo.title, defaultInfo.user_id, defaultInfo.memo],
    type
  );
  console.log(type);
  console.log(plannerId);

  // planner 생성중 에러 검증
  if (plannerId === errResponse(baseResponse.DB_ERROR)) return plannerId;
  if (!plannerId[0].insertId) {
    return errResponse(baseResponse.PLANNER_PLANNERID_NOT_EXIST);
  }
  // 시간표 저장
  for (let i = 0; i < timetableInfo.length; i++) {
    for (let j = 0; j < timetableInfo[i].schedule.length; j++) {
      const timetableId = await insertTimetable(connection, [
        plannerId[0].insertId,
        timetableInfo[i].schedule[j].place_name,
        timetableInfo[i].date,
        timetableInfo[i].schedule[j].started_at,
        timetableInfo[i].schedule[j].finished_at,
      ]);

      // 체크리스트 저장
      if (!timetableInfo[i].schedule[j].checklist) continue;
      for (let k = 0; k < timetableInfo[i].schedule[j].checklist.length; k++) {
        await insertChecklist(connection, [
          timetableId[0].insertId,
          timetableInfo[i].schedule[j].checklist[k].contents,
          timetableInfo[i].schedule[j].checklist[k].is_checked,
        ]);
      }
    }
  }
  connection.release();
  if (type === 1) {
    return response(baseResponse.SUCCESS, {
      planner_id: plannerId[0].insertId,
    });
  }
  return response(baseResponse.SUCCESS);
};

export const modifyPlanner = async (defaultInfo, timetableInfo) => {
  // user가 존재하는지 체크
  const userExist = await userIdCheck(defaultInfo.user_id);
  if (!userExist[0][0]) {
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  }
  const connection = await pool.getConnection(async (conn) => conn);
  const plannerId = await updatePlanner(connection, [
    defaultInfo.title,
    defaultInfo.memo,
    defaultInfo.planner_id,
  ]);

  // 시간표 + 체크리스트 삭제
  await deleteTimetable(connection, defaultInfo.planner_id);

  // 시간표 저장
  for (let i = 0; i < timetableInfo.length; i++) {
    for (let j = 0; j < timetableInfo[i].schedule.length; j++) {
      const timetableId = await insertTimetable(connection, [
        defaultInfo.planner_id,
        timetableInfo[i].schedule[j].place_name,
        timetableInfo[i].date,
        timetableInfo[i].schedule[j].started_at,
        timetableInfo[i].schedule[j].finished_at,
      ]);

      // 체크리스트 저장
      if (!timetableInfo[i].schedule[j].checklist) continue;
      for (let k = 0; k < timetableInfo[i].schedule[j].checklist.length; k++) {
        await insertChecklist(connection, [
          timetableId[0].insertId,
          timetableInfo[i].schedule[j].checklist[k].contents,
          timetableInfo[i].schedule[j].checklist[k].is_checked,
        ]);
      }
    }
  }
  connection.release();
  return response(baseResponse.SUCCESS);
};

export const createScrap = async (user_id, planner_id) => {
  // user가 존재하는지 체크
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) {
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  }

  // 여행계획서가 존재하는지 체크
  const plannerExist = await plannerIdCheck(planner_id);
  if (!plannerExist[0][0])
    return errResponse(baseResponse.PLANNER_PLANNERID_NOT_EXIST);
  // 업로드 된 여행계획서인지 체크
  if (plannerExist[0][0].is_uploaded === 0)
    return errResponse(baseResponse.PLANNER_PLANNER_IS_NOT_UPLOADED);
  // 여행계획서의 작성자가 본인이 아닌지 체크
  if (plannerExist[0][0].user_id === user_id)
    return errResponse(baseResponse.PLANNER_SCRAP_OWNER_IS_SAME);

  // 이미 스크랩이 되어있는지 체크
  const scrapExist = await scrapIdCheck(user_id, planner_id);
  if (scrapExist[0][0])
    return errResponse(baseResponse.PLANNER_SCRAP_ALREADY_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  await insertScrap(connection, [user_id, planner_id]);
  connection.release();

  return response(baseResponse.SUCCESS);
};

export const createPlannerReport = async (user_id, defaultInfo, reason) => {
  // user가 존재하는지 체크
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) {
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  }

  // 여행계획서가 존재하는지 체크
  const plannerExist = await plannerIdCheck(defaultInfo.planner_id);
  if (!plannerExist[0][0])
    return errResponse(baseResponse.PLANNER_PLANNERID_NOT_EXIST);
  // 업로드 된 여행계획서인지 체크
  if (plannerExist[0][0].is_uploaded === 0)
    return errResponse(baseResponse.PLANNER_PLANNER_IS_NOT_UPLOADED);

  // 이미 신고 한 적이 있는지 체크
  const beforeReport = await reportCheck(user_id, defaultInfo.planner_id);
  if (beforeReport[0][0]) return errResponse(baseResponse.REPORT_ALREADY_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  await insertPlannerReport(connection, [
    defaultInfo.planner_id,
    user_id,
    reason[0],
    reason[1],
    reason[2],
    reason[3],
    defaultInfo.contents,
  ]);
  await updatePlannerReportCount(connection, defaultInfo.planner_id);
  connection.release();

  if (defaultInfo.is_blocked === 1) {
    await createUserBlock(plannerExist[0][0].user_id, user_id);
    return response(baseResponse.SUCCESS);
  }

  return response(baseResponse.SUCCESS);
};

export const createUserBlock = async (blocked_user, user_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertUserBlockResult = await insertUserBlock(connection, [
    blocked_user,
    user_id,
  ]);

  connection.release();
  return insertUserBlockResult;
};
