import pool from '../../../config/database';
import axios from 'axios';
import { generateToken } from '../../../config/jwtMiddleware';
import { createSearchHistory } from '../Searching/searchingService';
import { selectPlannerListUpload } from '../Planner/plannerDao';
import { selectDiaryListPublic } from '../Diary/diaryDao';
import { selectUserKakaoId, selectUserbyId } from './userDao';
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
  const userIdCheckResult = selectUserbyId(connection, user_id);

  connection.release();
  return userIdCheckResult;
};

export const retrieveMypage = async (user_id) => {
  // 유저 기본 정보
  const userInfo = await userIdCheck(user_id);
  if (!userInfo[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const mypageResult = {
    id: userInfo[0][0].id,
    nickname: userInfo[0][0].nickname,
    likes: userInfo[0][0].likes,
    amount_planner: userInfo[0][0].amount_planner,
    amount_diary: userInfo[0][0].amount_diary,
    intro: userInfo[0][0].intro,
  };

  const connection = await pool.getConnection(async (conn) => conn);
  // 다이어리 목록
  const diaryList = await selectDiaryListPublic(connection, user_id);
  if (!diaryList[0][0]) {
    mypageResult.diary = null;
  } else {
    for (let i = 0; i < diaryList[0].length; i++) {
      const updatedTimeUTC = dayjs(diaryList[0][i].updated_at).utc();
      const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
      diaryList[0][i].updated_at = updatedTimeKorea.format('YYYY.MM.DD');
    }
    mypageResult.diary = diaryList[0];
  }

  // 여행계획서 목록
  const plannerList = await selectPlannerListUpload(connection, user_id);
  if (!plannerList[0][0]) {
    mypageResult.planner = null;
  } else {
    mypageResult.planner = plannerList[0];
  }

  connection.release();
  return response(baseResponse.SUCCESS, mypageResult);
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
    nickname: userInfo[0][0].nickname,
    likes: userInfo[0][0].likes,
    amount_planner: userInfo[0][0].amount_planner,
    amount_diary: userInfo[0][0].amount_diary,
    intro: userInfo[0][0].intro,
  };

  const connection = await pool.getConnection(async (conn) => conn);
  // 다이어리 목록
  const diaryList = await selectDiaryListPublic(connection, user_id);
  if (!diaryList[0][0]) {
    mypageResult.diary = null;
  } else {
    for (let i = 0; i < diaryList[0].length; i++) {
      const updatedTimeUTC = dayjs(diaryList[0][i].updated_at).utc();
      const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
      diaryList[0][i].updated_at = updatedTimeKorea.format('YYYY.MM.DD');
    }
    mypageResult.diary = diaryList[0];
  }

  // 여행계획서 목록
  const plannerList = await selectPlannerListUpload(connection, user_id);
  if (!plannerList[0][0]) {
    mypageResult.planner = null;
  } else {
    mypageResult.planner = plannerList[0];
  }

  connection.release();

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
