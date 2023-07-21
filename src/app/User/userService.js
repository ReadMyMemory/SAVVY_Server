import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import axios from 'axios';
import { generateToken } from '../../../config/jwtMiddleware';
import { response, errResponse } from '../../../config/response';
import { loginIdCheck } from './userProvider';
import { insertUserInfo } from './userDao';

export const createUser = async (accessToken, pic_url, nickname, intro) => {
  const kakaoId = await axios({
    method: 'get',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  })
    .then(function (response) {
      return response.data.id;
    })
    .catch(() => {
      return 'error';
    });
  // 예외처리
  if (kakaoId === 'error') return errResponse(baseResponse.AXIOS_ERROR);
  // 유저 존재 확인
  const userExist = await loginIdCheck(kakaoId);
  if (userExist[0][0])
    return errResponse(baseResponse.USER_USERID_ALREADY_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  const insertUserInfoResult = insertUserInfo(connection, [
    kakaoId,
    pic_url,
    nickname,
    intro,
  ]);
  console.log(insertUserInfoResult.insertId);
  // const new_id = insertUserInfoResult.insertId;
  connection.release();

  const generateTokenResult = await generateToken({
    id: insertUserInfoResult.insertId,
  })
    .then((token) => {
      return { token: token };
    })
    .catch((err) => {
      return 'error';
    });
  if (generateTokenResult === 'error')
    return errResponse(baseResponse.TOKEN_GENERATE_ERROR);
  return response(baseResponse.SUCCESS, generateTokenResult);
};
