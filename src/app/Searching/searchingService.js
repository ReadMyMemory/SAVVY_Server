import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import {
  insertSearchHistory,
  deleteSearchHistory,
  deleteSearchHistoryAll,
} from './searchingDao';
import { userIdCheck } from '../User/userProvider';

export const createSearchHistory = async (user_id, search_word, is_user) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertSearchHistoryResult = await insertSearchHistory(connection, [
    user_id,
    search_word,
    is_user,
  ]);
  connection.release();

  return insertSearchHistoryResult;
};

export const deleteSearchList = async (user_id, search_word, is_user) => {
  // 유저 존재 체크
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  const deleteSearchHistoryResult = await deleteSearchHistory(connection, [
    user_id,
    search_word,
    is_user,
  ]);

  connection.release();
  return response(baseResponse.SUCCESS);
};

export const deleteSearchListAll = async (user_id, is_user) => {
  // 유저 존재 체크
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  const deleteSearchHistoryAllResult = await deleteSearchHistoryAll(
    connection,
    [user_id, is_user]
  );

  connection.release();
  return response(baseResponse.SUCCESS);
};
