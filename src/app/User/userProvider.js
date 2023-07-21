import pool from '../../../config/database';
import axios from 'axios';
import { selectUserKakaoId } from './userDao';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';

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
  return response(baseResponse.SUCCESS, userKakaoCheck[0][0]);
};

export const loginIdCheck = async (kakao_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const loginIdCheckResult = selectUserKakaoId(connection, kakao_id);

  connection.release();

  return loginIdCheckResult;
};
