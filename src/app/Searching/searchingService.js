import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import { insertSearchHistory } from './searchingDao';
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
