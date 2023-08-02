import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
    selectCommentbyId,
    selectCommentListbyId,
    selectReplyListbyId
    } from "./commentDao";

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

export const commentIdCheck = async(comment_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const commentIdCheckResult = selectCommentbyId(connection, comment_id);

    connection.release();
    return commentIdCheckResult;
};

export const retrieveCommentList = async(diary_id, user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveCommentListResult = selectCommentListbyId(connection, [
        diary_id,
        user_id
    ]);
    //일단은 임시 방법. dayjs를 사용
    //시간을 한국 시간대로 변경해 YYYY-MM-DD HH:mm:ss 형식으로 변환하는 과정. 다른 방식으로도 변환 가능.
    for(let i = 0; i < retrieveCommentListResult[0].length; i++) {
        const updatedTimeUTC = dayjs(retrieveCommentListResult[0][i].updated_at).utc();
        const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
        retrieveCommentListResult[0][i].updated_at = updatedTimeKorea.format('YYYY.MM.DD');
    }
    connection.release();
    return retrieveCommentListResult;
};

export const retrieveReplyList = async(comment_id, user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveReplyListResult = selectReplyListbyId(connection, [
        comment_id,
        user_id
    ]);

    connection.release();
    return retrieveReplyListResult;
};