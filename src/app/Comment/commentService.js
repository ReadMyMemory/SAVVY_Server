import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {insertComment, insertReply } from './commentDao';

export const createComment = async(diary_id, user_id, contents) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const createCommentResult = await insertComment(connection, [
        diary_id,
        user_id,
        contents
    ]);

    connection.release();
    return response(baseResponse.SUCCESS);
}

export const createReply = async(comment_id, user_id, contents) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const createReplyResult = await insertReply(connection, [
        comment_id,
        user_id,
        contents
    ]);

    connection.release();
    return response(baseResponse.SUCCESS);

}