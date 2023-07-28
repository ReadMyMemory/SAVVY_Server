import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import { userIdCheck } from '../User/userProvider';
import { selectUserbyId } from '../User/userDao';
import baseResponse from '../../../config/baseResponseStatus';
import {
  selectPlannerListById,
  selectPlannerbyId,
  selectScrapbyId,
  selectPlannerId,
  selectTimetableId,
  selectPlannerSearch,
  selectPlannerDetail,
  selectTimetableDetail,
  selectChecklistDetail,
} from './plannerDao';
import dayjs, { Dayjs } from 'dayjs';
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// export const userIdCheck = async (user_id) => {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userIdCheckResult = selectUserbyId(connection, user_id);

//   connection.release();
//   return userIdCheckResult;
// };

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
    // 전체보기 시간 포맷 변환
    if (type === 0) {
      for (let i = 0; i < retrievePlannerListResult[0].length; i++) {
        const updatedTimeUTC = dayjs(
          retrievePlannerListResult[0][i].updated_at
        ).utc();
        const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
        retrievePlannerListResult[0][i].updated_at =
          updatedTimeKorea.format('YYYY.MM.DD');
      }
    }

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

  // 검색결과 시간 포맷 변경
  for (let i = 0; i < retrievePlannerSearchResult[0].length; i++) {
    const updatedTimeUTC = dayjs(
      retrievePlannerSearchResult[0][i].updated_at
    ).utc();
    const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
    retrievePlannerSearchResult[0][i].updated_at =
      updatedTimeKorea.format('YYYY.MM.DD');
  }
  return response(baseResponse.SUCCESS, retrievePlannerSearchResult[0]);
};

export const retrievePlannerdetail = async (user_id, planner_id) => {
  // 유저 존재 확인
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  // planner 기본 정보
  const connection = await pool.getConnection(async (conn) => conn);
  const defaultInfo = await selectPlannerDetail(connection, planner_id);
  // planner가 없을 경우
  if (!defaultInfo[0][0])
    return errResponse(baseResponse.PLANNER_PLANNERID_NOT_EXIST);

  // timetable 정보
  const selectTimetableDetailResult = await selectTimetableDetail(
    connection,
    planner_id
  );
  const timetableInfo = selectTimetableDetailResult[0];
  // timetable이 없을 경우
  if (!timetableInfo[0])
    return errResponse(baseResponse.PLANNER_TIMETABLEID_NOT_EXIST);

  // checklist 정보
  for (let i = 0; i < timetableInfo.length; i++) {
    const selectChecklistResult = await selectChecklistDetail(
      connection,
      timetableInfo[i].id
    );
    if (!selectChecklistResult[0][0]) {
      timetableInfo[i].checklist = null;
      continue;
    }
    timetableInfo[i].checklist = selectChecklistResult[0];
  }

  // default + timetable
  const timetable = new Array();
  const timetableObj = { date: null, schedule: new Array() };
  let tmp = timetableInfo[0].date;
  for (let i = 0; i < timetableInfo.length; i++) {
    if (timetableInfo[i].date !== tmp) {
      timetable.push(Object.assign({}, timetableObj));
      console.log(timetable);
      tmp = timetableInfo[i].date;
      timetableObj.schedule = new Array();
      console.log(`날짜 변경`);
    }
    timetableObj.date = tmp;
    delete timetableInfo[i].date;
    timetableObj.schedule.push(timetableInfo[i]);
  }
  console.log(timetableObj);
  console.log(timetable);
  timetable.push(Object.assign({}, timetableObj));

  defaultInfo[0][0].timetable = timetable;
  console.log(defaultInfo[0][0]);

  connection.release();

  // Response
  return response(baseResponse.SUCCESS, defaultInfo[0][0]);
};
