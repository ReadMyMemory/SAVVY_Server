import pool from '../../../config/database';
import axios from 'axios';
import { generateToken } from '../../../config/jwtMiddleware';
import { createSearchHistory } from '../Searching/searchingService';
import { dateDivider } from '../Comment/commentProvider';
import { selectPlannerListUpload } from '../Planner/plannerDao';
import { selectDiaryListPublic } from '../Diary/diaryDao';
import {
  selectUserKakaoId,
  selectUserbyId,
  updateUserDiaryCount,
  updateUserPlannerCount,
  selectUserbyNickname,
  selectUserBlockList,
  selectAlarmList,
} from './userDao';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import dayjs, { Dayjs } from 'dayjs';
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

export const retrieveKakaoLogin = async (accessToken) => {
  const kakaoData = await axios({
    method: 'get',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  })
    .then(function (response) {
      return response.data;
    })
    .catch(() => {
      return 'error';
    });
  // 예외처리
  if (kakaoData === 'error') return errResponse(baseResponse.AXIOS_ERROR);
  // 회원정보 있는지 검증
  const userKakaoCheck = await loginIdCheck(kakaoData.id);
  if (!userKakaoCheck[0][0]) return errResponse(baseResponse.USER_NEED_SIGNUP);
  const generateTokenResult = await generateToken({
    id: userKakaoCheck[0][0].id,
  })
    .then((token) => {
      console.log(token);
      return { token: token, nickname: userKakaoCheck[0][0].nickname };
    })
    .catch((err) => {
      return 'error';
    });
  console.log(generateTokenResult);
  if (generateTokenResult === 'error')
    return errResponse(baseResponse.TOKEN_GENERATE_ERROR);
  return response(baseResponse.SUCCESS, generateTokenResult);
};

export const loginIdCheck = async (kakao_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const loginIdCheckResult = selectUserKakaoId(connection, kakao_id);

  connection.release();

  return loginIdCheckResult;
};

export const userIdCheck = async (user_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdCheckResult = await selectUserbyId(connection, user_id);

  connection.release();
  return userIdCheckResult;
};

export const retrieveUserNickname = async (nickname) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const userNicknameCheck = await selectUserbyNickname(connection, nickname);

  connection.release();
  if (!userNicknameCheck[0][0]) return response(baseResponse.SUCCESS);
  return errResponse(baseResponse.USER_USERID_ALREADY_EXIST);
};

export const retrieveMypage = async (user_id) => {
  // 유저 기본 정보
  const userInfo = await userIdCheck(user_id);
  if (!userInfo[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const mypageResult = {
    id: userInfo[0][0].id,
    pic_url: userInfo[0][0].pic_url,
    nickname: userInfo[0][0].nickname,
    intro: userInfo[0][0].intro,
    likes: userInfo[0][0].likes,
    amount_diary: userInfo[0][0].amount_diary,
    amount_planner: userInfo[0][0].amount_planner,
  };

  return response(baseResponse.SUCCESS, mypageResult);
};

export const retrieveMypageDiary = async (user_id) => {
  // 유저 기본 정보
  const userInfo = await userIdCheck(user_id);
  if (!userInfo[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  // 다이어리 목록
  const diaryResult = {};
  const diaryList = await selectDiaryListPublic(connection, user_id);
  let likesCnt = 0;
  if (!diaryList[0][0]) {
    diaryResult.diary = null;
    diaryResult.likes = 0;
    diaryResult.amount_diary = 0;
  } else {
    for (let i = 0; i < diaryList[0].length; i++) {
      // updated_at 포맷 변경
      const updatedTimeUTC = dayjs(diaryList[0][i].updated_at).utc();
      const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
      diaryList[0][i].updated_at = updatedTimeKorea.format('YYYY.MM.DD');

      // 좋아요 수 집계
      likesCnt += diaryList[0][i].likes_count;
    }
    diaryResult.diary = diaryList[0];
    diaryResult.likes = likesCnt;
    diaryResult.amount_diary = diaryList[0].length;
  }
  // 유저 정보 갱신
  await updateUserDiaryCount(connection, [
    diaryResult.likes,
    diaryResult.amount_diary,
    user_id,
  ]);

  connection.release();
  return response(baseResponse.SUCCESS, diaryResult);
};

export const retrieveMypagePlanner = async (user_id) => {
  // 유저 기본 정보
  const userInfo = await userIdCheck(user_id);
  if (!userInfo[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  // 여행계획서 목록
  const plannerResult = {};
  const plannerList = await selectPlannerListUpload(connection, user_id);
  if (!plannerList[0][0]) {
    plannerResult.planner = null;
    plannerResult.amount_planner = 0;
  } else {
    plannerResult.planner = plannerList[0];
    plannerResult.amount_planner = plannerList[0].length;
  }
  // 유저 정보 갱신
  await updateUserPlannerCount(connection, [
    plannerResult.amount_planner,
    user_id,
  ]);

  connection.release();
  return response(baseResponse.SUCCESS, plannerResult);
};

export const retrieveUserPage = async (user_id, my_id, searching) => {
  // 내 아이디 존재 확인
  const AmIExist = await userIdCheck(my_id);
  if (!AmIExist[0][0])
    return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

  // 유저 기본 정보
  const userInfo = await userIdCheck(user_id);
  if (!userInfo[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const mypageResult = {
    id: userInfo[0][0].id,
    pic_url: userInfo[0][0].pic_url,
    nickname: userInfo[0][0].nickname,
    intro: userInfo[0][0].intro,
    likes: userInfo[0][0].likes,
    amount_diary: userInfo[0][0].amount_diary,
    amount_planner: userInfo[0][0].amount_planner,
  };

  if (searching === 'true') {
    // 검색기록 저장
    const HistoryResult = await createSearchHistory(
      my_id,
      mypageResult.nickname,
      1
    );
    if (!HistoryResult[0].insertId)
      return errResponse(baseResponse.SEARCHING_HISTORY_INSERT_ERROR);
  }

  return response(baseResponse.SUCCESS, mypageResult);
};

export const retrieveUserPageDiary = async (user_id) => {
  // 유저 기본 정보
  const userInfo = await userIdCheck(user_id);
  if (!userInfo[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  // 다이어리 목록
  const diaryResult = {};
  const diaryList = await selectDiaryListPublic(connection, user_id);
  let likesCnt = 0;
  if (!diaryList[0][0]) {
    diaryResult.diary = null;
    diaryResult.likes = 0;
    diaryResult.amount_diary = 0;
  } else {
    for (let i = 0; i < diaryList[0].length; i++) {
      const updatedTimeUTC = dayjs(diaryList[0][i].updated_at).utc();
      const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
      diaryList[0][i].updated_at = updatedTimeKorea.format('YYYY.MM.DD');

      // 좋아요 수 집계
      likesCnt += diaryList[0][i].likes_count;
    }
    diaryResult.diary = diaryList[0];
    diaryResult.likes = likesCnt;
    diaryResult.amount_diary = diaryList[0].length;
  }

  // 유저 정보 갱신
  await updateUserDiaryCount(connection, [
    diaryResult.likes,
    diaryResult.amount_diary,
    user_id,
  ]);

  connection.release();
  return response(baseResponse.SUCCESS, diaryResult);
};

export const retrieveUserPagePlanner = async (user_id) => {
  // 유저 기본 정보
  const userInfo = await userIdCheck(user_id);
  if (!userInfo[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);

  // 여행계획서 목록
  const plannerResult = {};
  const plannerList = await selectPlannerListUpload(connection, user_id);
  if (!plannerList[0][0]) {
    plannerResult.planner = null;
    plannerResult.amount_planner = 0;
  } else {
    plannerResult.planner = plannerList[0];
    plannerResult.amount_planner = plannerList[0].length;
  }

  // 유저 정보 갱신
  await updateUserPlannerCount(connection, [
    plannerResult.amount_planner,
    user_id,
  ]);

  connection.release();
  return response(baseResponse.SUCCESS, plannerResult);
};

export const retrieveUserBlockList = async (user_id) => {
  // 유저 기본 정보
  const userInfo = await userIdCheck(user_id);
  if (!userInfo[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);

  const userBlockList = await selectUserBlockList(connection, user_id);
  connection.release();

  if (!userBlockList[0][0])
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  return response(baseResponse.SUCCESS, userBlockList[0]);
};

export const retrieveAlarmList = async (user_id) => {
  // 유저 기본 정보
  const userInfo = await userIdCheck(user_id);
  if (!userInfo[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);

  const userAlarmList = await selectAlarmList(connection, user_id);

  if (!userAlarmList[0][0]) {
    connection.release();
    return errResponse(baseResponse.ALARM_LIST_NOT_EXIST);
  }

  console.log(userAlarmList[0]);

  // 알림 내용 생성
  for (let i = 0; i < userAlarmList[0].length; i++) {
    //댓글 updated_at 표시 변화
    userAlarmList[0][i].updated_at = await dateDivider(
      userAlarmList[0][i].updated_at
    );
    if (userAlarmList[0][i].updated_at === -1)
      userAlarmList[0][i] = errResponse(baseResponse.TIME_ERROR);

    switch (userAlarmList[0][i].type) {
      case 'like':
        userAlarmList[0][i].body =
          userAlarmList[0][i].nickname + ' 님이 회원님의 게시글을 좋아합니다';
        break;
      case 'comment':
        userAlarmList[0][i].body =
          userAlarmList[0][i].nickname +
          ' 님이 회원님의 게시글에 댓글을 남겼습니다';
        break;
      case 'reply':
        userAlarmList[0][i].body =
          userAlarmList[0][i].nickname +
          ' 님이 회원님의 댓글에 답글을 남겼습니다';
        break;
      default:
        connection.release();
        return errResponse(baseResponse.ALARM_TYPE_INVALID);
    }
  }
  connection.release();
  return response(baseResponse.SUCCESS, userAlarmList[0]);
};
