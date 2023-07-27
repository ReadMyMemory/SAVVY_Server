import pool from '../../../config/database';
import axios from 'axios';
import { generateToken } from '../../../config/jwtMiddleware';
import { selectUserKakaoId, selectUserbyId } from './userDao';
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
  const generateTokenResult = await generateToken({
    id: userKakaoCheck[0][0].id,
  })
    .then((token) => {
      console.log(token);
      return { token: token };
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
