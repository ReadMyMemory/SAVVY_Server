import pool from '../../../config/database';
import axios from 'axios';
import { selectUserLoginId } from './userDao';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';

export const retrieveKakaoLogin = async (accessToken) => {
  axios({
    method: 'get',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  })
    .then(function (response) {
      const kakaoData = response.data;
      console.log(kakaoData);
    })
    .catch(() => {
      return errResponse(baseResponse.AXIOS_ERROR);
    });

  return response(baseResponse.SUCCESS, kakaoData);
};

export const loginIdCheck = async (id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const loginIdCheckResult = selectUserLoginId(connection, id);

  connection.release();

  return loginIdCheckResult;
};
