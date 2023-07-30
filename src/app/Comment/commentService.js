import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
    insertComment,
    insertReply,
} from './commentDao';
import {
    diaryIdCheck
} from "../Diary/diaryProvider";
import {
    commentIdCheck
} from "./commentProvider";

export const createComment = async(diary_id, user_id, contents) => {
    // diary가 존재하는지 체크
    const diaryExist = await diaryIdCheck(diary_id);
    if (!diaryExist[0][0]) {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    await insertComment(connection, [
        diary_id,
        user_id,
        contents
    ]);

    connection.release();
    return response(baseResponse.SUCCESS);
}

export const createReply = async(comment_id, user_id, contents) => {
    // comment가 존재하는지 체크
    const commentExist = await commentIdCheck(comment_id);
    if (!commentExist[0][0]) {
        return errResponse(baseResponse.COMMENT_COMMENTID_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    await insertReply(connection, [
        comment_id,
        user_id,
        contents
    ]);

    connection.release();
    return response(baseResponse.SUCCESS);

}