import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import { errResponse } from '../../../config/response';
import crypto from 'crypto';
import { response } from 'express';
import { loginIdCheck } from './userProvider';
import { insertUserInfo } from './userDao';

export const createUser = async (id, password, image, nickname, intro) => {
  try {
    // 아이디 중복 확인
    const loginIdRows = await loginIdCheck(id);
    if (loginIdRows.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

    const hashedPassword = crypto
      .createHash('sha512')
      .update(password)
      .digest('hex');

    const insertUserInfoParams = [id, hashedPassword, image, nickname, intro];

    const connection = await pool.getConnection(async (conn) => conn);

    const userIdResult = await insertUserInfo(connection, insertUserInfoParams);
    console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
    connection.release();
    return baseResponse.SUCCESS;
  } catch (err) {
    return errResponse(baseResponse.DB_ERROR);
  }
};
