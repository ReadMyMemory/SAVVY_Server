import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import axios from 'axios';
import { generateToken } from '../../../config/jwtMiddleware';
import { response, errResponse } from '../../../config/response';
import {
  loginIdCheck,
  userIdCheck
} from './userProvider';
import {
  insertUserInfo,
  modifyUserProfileImgEmpty,
  modifyUserProfileImgExist
} from './userDao';

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
  const insertUserInfoResult = await insertUserInfo(connection, [
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
      return { token: token, nickname: nickname };
    })
    .catch((err) => {
      return 'error';
    });
  if (generateTokenResult === 'error')
    return errResponse(baseResponse.TOKEN_GENERATE_ERROR);
  return response(baseResponse.SUCCESS, generateTokenResult);
};

export const modifyProfile = async (user_id, pic_url, nickname, intro) => {
  //유저 존재 확인
  const userExist = await userIdCheck(user_id);
  if(!userExist[0][0])
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  if(!pic_url) {
    await modifyUserProfileImgEmpty(connection, [
        nickname,
        intro,
        user_id
    ]);
  } else {
    await modifyUserProfileImgExist(connection, [
        pic_url,
        nickname,
        intro,
        user_id
    ]);
  }
  connection.release();
  return response(baseResponse.SUCCESS);
};