import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
  selectCommentbyId,
  selectCommentListbyId,
  selectReplyListbyId,
  showReplyCountbyId
} from './commentDao';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration);

export const commentIdCheck = async (comment_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const commentIdCheckResult = selectCommentbyId(connection, comment_id);

  connection.release();
  return commentIdCheckResult;
};



export const dateDivider = async (datevalue) => {
  const nowDate = dayjs();
  const createDate = dayjs(datevalue);
  const diffDate = nowDate.diff(createDate);
  const d = dayjs.duration(diffDate);
  const checkminus = d.milliseconds(); // updated_at이 현재 시간보다 미래인지를 판단.
  if(checkminus <= 0) datevalue = -1;
  else {
    if (d.years() != 0) {
      datevalue = d.years() + "년 전";
    } else if (d.months() != 0) {
      datevalue = d.months() + "개월 전";
    } else if (d.days() != 0) {
      datevalue = d.days() + "일 전";
    } else if (d.hours() != 0) {
      datevalue = d.hours() + "시간 전";
    } else if (d.minutes() != 0) {
      datevalue = d.minutes() + "분 전";
    } else {
      datevalue = d.seconds() + "초 전";
    }
  }
  return datevalue;
};

export const retrieveCommentList = async (diary_id, user_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveCommentListResult = await selectCommentListbyId(connection, [
    diary_id,
    user_id,
  ]);
  if(retrieveCommentListResult[0][0]) {
    // 답글 수 표시
    for (let p = 0; p < retrieveCommentListResult.length; p++) {
      const countValue = await showReplyCountbyId(connection, retrieveCommentListResult[0][p].id);
      retrieveCommentListResult[0][p].reply_count = countValue[0][0].count;
    }
  // is_updated의 boolean 치환
  for(let i = 0; i < retrieveCommentListResult[0].length; i ++) {
    if (retrieveCommentListResult[0][i].is_updated === 'true') retrieveCommentListResult[0][i].is_updated = true;
    else if (retrieveCommentListResult[0][i].is_updated === 'false') retrieveCommentListResult[0][i].is_updated = false;
    else return errResponse(baseResponse.COMMENT_IS_UPDATED_DATETYPE_EXCEPTION);
    retrieveCommentListResult[0][i].updated_at = await dateDivider(retrieveCommentListResult[0][i].updated_at);
    if(retrieveCommentListResult[0][i].updated_at === -1) retrieveCommentListResult[0][i] = errResponse(baseResponse.TIME_ERROR);
  }
  }
  connection.release();
  return response(baseResponse.SUCCESS, retrieveCommentListResult[0]);
};

export const retrieveReplyList = async (comment_id, user_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveReplyListResult = await selectReplyListbyId(connection, [
    comment_id,
    user_id,
  ]);

  // is_updated의 boolean 치환
  for(let j = 0; j < retrieveReplyListResult[0].length; j++) {
    if (retrieveReplyListResult[0][j].is_updated === 'true') retrieveReplyListResult[0][j].is_updated = true;
    else if (retrieveReplyListResult[0][j].is_updated === 'false') retrieveReplyListResult[0][j].is_updated = false;
    else return errResponse(baseResponse.REPLY_IS_UPDATED_DATETYPE_EXCEPTION);
    retrieveReplyListResult[0][j].updated_at = await dateDivider(retrieveReplyListResult[0][j].updated_at);
    if(retrieveReplyListResult[0][j].updated_at === -1) retrieveReplyListResult[0][j] = errResponse(baseResponse.TIME_ERROR);
  }
  connection.release();
  return response(baseResponse.SUCCESS, retrieveReplyListResult[0]);
};
