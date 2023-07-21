import pool from '../../../config/database';
import { selectUserLoginId } from './userDao';

export const loginIdCheck = async (id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const loginIdCheckResult = selectUserLoginId(connection, id);

  connection.release();

  return loginIdCheckResult;
};
