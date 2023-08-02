import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
  selectCommentbyId,
  selectCommentListbyId,
  selectReplyListbyId,
} from './commentDao';

export const commentIdCheck = async (comment_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const commentIdCheckResult = selectCommentbyId(connection, comment_id);

  connection.release();
  return commentIdCheckResult;
};

export const retrieveCommentList = async (diary_id, user_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveCommentListResult = await selectCommentListbyId(connection, [
    diary_id,
    user_id,
  ]);
  connection.release();
  return retrieveCommentListResult[0];
};

export const retrieveReplyList = async (comment_id, user_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveReplyListResult = selectReplyListbyId(connection, [
    comment_id,
    user_id,
  ]);

  connection.release();
  return retrieveReplyListResult;
};
