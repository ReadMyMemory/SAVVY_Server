import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {diaryIdCheck, userIdCheck} from "../Diary/diaryProvider";
import {
  selectCommentbyId,
  selectCommentListbyId,
  selectReplyListbyId,
  showReplyCountbyId,
  selectReplybyId,
  selectCommentReported,
  selectReplyReported
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

export const replyIdCheck = async (reply_id) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const replyIdCheckResult = selectReplybyId(connection, reply_id);

  connection.release();
  return replyIdCheckResult;
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

export const retrieveCommentListAll = async(diary_id, user_id) => {
  // user가 존재하는지 체크
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) {
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);
  }
  // diary가 존재하는지 체크
  const diaryExist = await diaryIdCheck(diary_id)
  if (!diaryExist[0][0]) {
    return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
  }
  const connection = await pool.getConnection(async (conn) => conn);
  const retrieveCommentListResult = await selectCommentListbyId(connection, [
    diary_id,
    user_id,
  ]);
  for (let i = 0; i < retrieveCommentListResult[0].length; i++) {
    // 답글 수 표시
    const countValue = await showReplyCountbyId(connection, retrieveCommentListResult[0][i].id);
    retrieveCommentListResult[0][i].reply_count = countValue[0][0].count;

    //댓글 is_updated의 boolean 치환
    if (retrieveCommentListResult[0][i].is_updated === 'true')
      retrieveCommentListResult[0][i].is_updated = true;
    else if (retrieveCommentListResult[0][i].is_updated === 'false')
      retrieveCommentListResult[0][i].is_updated = false;
    else {
      connection.release();
      return errResponse(baseResponse.COMMENT_IS_UPDATED_DATETYPE_EXCEPTION);
    }

    //댓글 updated_at 표시 변화
    retrieveCommentListResult[0][i].updated_at = await dateDivider(retrieveCommentListResult[0][i].updated_at);
    if (retrieveCommentListResult[0][i].updated_at === -1)
      retrieveCommentListResult[0][i] = errResponse(baseResponse.TIME_ERROR);


    // 답글 리스트 불러오기
    // comment가 존재하는지 체크
    const commentExist = await commentIdCheck(retrieveCommentListResult[0][i].id);
    if (!commentExist[0][0]) {
      connection.release();
      return errResponse(baseResponse.COMMENT_COMMENTID_NOT_EXIST);
    }
    const retrieveReplyListResult = await selectReplyListbyId(connection, [
      retrieveCommentListResult[0][i].id,
      user_id
    ]);

    for (let j = 0; j < retrieveReplyListResult[0].length; j++) {
      //댓글 is_updated의 boolean 치환
      if (retrieveReplyListResult[0][j].is_updated === 'true')
        retrieveReplyListResult[0][j].is_updated = true;
      else if (retrieveReplyListResult[0][j].is_updated === 'false')
        retrieveReplyListResult[0][j].is_updated = false;
      else
        retrieveReplyListResult[0][j] = errResponse(baseResponse.REPLY_IS_UPDATED_DATETYPE_EXCEPTION);
      // 답글의 updated_at 표시 변화
      retrieveReplyListResult[0][j].updated_at = await dateDivider(retrieveReplyListResult[0][j].updated_at);
      if (retrieveReplyListResult[0][j].updated_at === -1)
        retrieveReplyListResult[0][j] = errResponse(baseResponse.TIME_ERROR);
    }
    retrieveCommentListResult[0][i].reply_List = retrieveReplyListResult[0];
  }
    connection.release();
    return response(baseResponse.SUCCESS, retrieveCommentListResult[0]);
};

export const reportCheck = async (user_id, value, type) => {
  const connection = await pool.getConnection(async (conn) => conn);
  if(type === 1) {
    const selectCommentReportedResult = await selectCommentReported(connection, [
        user_id,
        value
    ]);
    connection.release();
    return selectCommentReportedResult;
  } else if(type === 2) {
    const selectReplyReportedResult = await selectReplyReported(connection, [
        user_id,
        value
    ]);
    connection.release();
    return selectReplyReportedResult;
  }
};
