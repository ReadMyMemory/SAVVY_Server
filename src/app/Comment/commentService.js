import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
    insertComment,
    insertReply,
    updateComment,
    updateReply,
    deleteComment,
    deleteReply
} from './commentDao';
import {
    diaryIdCheck
} from "../Diary/diaryProvider";
import {
    commentIdCheck,
    replyIdCheck
} from "./commentProvider";

export const createComment = async(diary_id, user_id, content) => {
    // diary가 존재하는지 체크
    const diaryExist = await diaryIdCheck(diary_id);
    if (!diaryExist[0][0]) {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    await insertComment(connection, [
        diary_id,
        user_id,
        content
    ]);

    connection.release();
    return response(baseResponse.SUCCESS);
};

export const createReply = async(comment_id, user_id, content) => {
    // comment가 존재하는지 체크
    const commentExist = await commentIdCheck(comment_id);
    if (!commentExist[0][0]) {
        return errResponse(baseResponse.COMMENT_COMMENTID_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    await insertReply(connection, [
        comment_id,
        user_id,
        content
    ]);

    connection.release();
    return response(baseResponse.SUCCESS);
};

export const modifyComment = async(user_id, updateContent) => {
    // comment가 존재하는지 체크
    const commentExist = await commentIdCheck(updateContent.comment_id);
    if (!commentExist[0][0]) {
        return errResponse(baseResponse.COMMENT_COMMENTID_NOT_EXIST);
    }
    // 수정하려는 사람과 작성자가 동일한 지 확인
    if(user_id !== commentExist[0][0].user_id) return errResponse(baseResponse.USER_USERID_NOT_MATCH_COMMENTOWNER);
    const connection = await pool.getConnection(async (conn) => conn);
    await updateComment(connection, [
        updateContent.content,
        updateContent.comment_id
    ]);

    connection.release();
    return response(baseResponse.SUCCESS);
};

export const modifyReply = async(user_id, updateContent) => {
    // reply가 존재하는지 체크
    const replyExist = await replyIdCheck(updateContent.reply_id);
    if(!replyExist[0][0]) {
        return errResponse(baseResponse.REPLY_REPLYID_NOT_EXIST);
    }
    // 수정하려는 사람과 작성자가 동일한 지 확인
    if(user_id !== replyExist[0][0].user_id) return errResponse(baseResponse.USER_USERID_NOT_MATCH_REPLYOWNER);
    const connection = await pool.getConnection(async (conn) => conn);
    await updateReply(connection, [
        updateContent.content,
        updateContent.reply_id
    ]);

    connection.release();
    return response(baseResponse.SUCCESS);
};

export const deleteCommentCheck = async(user_id, comment_id) => {
    // comment가 존재하는지 체크
    const commentExist = await commentIdCheck(comment_id);
    if (!commentExist[0][0]) {
        return errResponse(baseResponse.COMMENT_COMMENTID_NOT_EXIST);
    }
    // 삭제하려는 사람과 작성자가 동일한 지 확인
    if(user_id !== commentExist[0][0].user_id) return errResponse(baseResponse.USER_USERID_NOT_MATCH_COMMENTOWNER);
    const connection = await pool.getConnection(async (conn) => conn);
    await deleteComment(connection, comment_id);

    connection.release();
    return response(baseResponse.SUCCESS);
};

export const deleteReplyCheck = async(user_id, reply_id) => {
    // reply가 존재하는지 체크
    const replyExist = await replyIdCheck(reply_id);
    if(!replyExist[0][0]) {
        return errResponse(baseResponse.REPLY_REPLYID_NOT_EXIST);
    }
    // 삭제하려는 사람과 작성자가 동일한 지 확인
    if(user_id !== replyExist[0][0].user_id) return errResponse(baseResponse.USER_USERID_NOT_MATCH_REPLYOWNER);
    const connection = await pool.getConnection(async (conn) => conn);
    await deleteReply(connection, reply_id);

    connection.release();
    return response(baseResponse.SUCCESS);
}