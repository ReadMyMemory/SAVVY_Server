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