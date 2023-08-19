import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
    insertComment,
    insertReply,
    updateComment,
    updateReply,
    deleteComment,
    deleteReply,
    insertCommentReport,
    insertReplyReport,
    updateCommentReportCount,
    updateReplyReportCount,
    insertCommentCount,
    deleteCommentCount
} from './commentDao';
import {
    diaryIdCheck
} from "../Diary/diaryProvider";
import {
    commentIdCheck,
    replyIdCheck,
    reportCheck
} from "./commentProvider";
import {createUserBlock} from "../Planner/plannerService";
import {userIdCheck} from "../User/userProvider";

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
    await insertCommentCount(connection, diary_id);

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
    if(user_id !== commentExist[0][0].user_id)
        return errResponse(baseResponse.USER_USERID_NOT_MATCH_COMMENTOWNER);
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
    if(user_id !== replyExist[0][0].user_id)
        return errResponse(baseResponse.USER_USERID_NOT_MATCH_REPLYOWNER);
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
    if(user_id !== commentExist[0][0].user_id)
        return errResponse(baseResponse.USER_USERID_NOT_MATCH_COMMENTOWNER);
    const connection = await pool.getConnection(async (conn) => conn);
    await deleteComment(connection, comment_id);
    await deleteCommentCount(connection, commentExist[0][0].diary_id);

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
    if(user_id !== replyExist[0][0].user_id)
        return errResponse(baseResponse.USER_USERID_NOT_MATCH_REPLYOWNER);
    const connection = await pool.getConnection(async (conn) => conn);
    await deleteReply(connection, reply_id);

    connection.release();
    return response(baseResponse.SUCCESS);
}

export const createCommentReport = async(user_id, defaultInfo, reason) => {
    // user가 존재하는지 체크
    const userExist = await userIdCheck(user_id);
    if (!userExist[0][0]) {
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);
    }
    // comment가 존재하는지 체크
    const commentExist = await commentIdCheck(defaultInfo.comment_id);
    if (!commentExist[0][0]) {
        return errResponse(baseResponse.COMMENT_COMMENTID_NOT_EXIST);
    }
    // 본인이 본인을 신고하는 경우를 체크
    if(user_id === commentExist[0][0].user_id)
        return errResponse(baseResponse.REPORT_NOT_REPORT_OWNSELF);
    // 이미 신고 한 적이 있는지 체크
    const beforeReport = await reportCheck(user_id, defaultInfo.comment_id, 1);
    if (beforeReport[0][0])
        return errResponse(baseResponse.REPORT_COMMENT_ALREADY_EXIST);
    const connection = await pool.getConnection(async (conn) => conn);
    await insertCommentReport(connection, [
        defaultInfo.comment_id,
        user_id,
        reason[0],
        reason[1],
        reason[2],
        reason[3],
        defaultInfo.contents,
    ]);
    await updateCommentReportCount(connection, defaultInfo.comment_id);

    if (defaultInfo.is_blocked === 1) {
        await createUserBlock(commentExist[0][0].user_id, user_id);
    }
    connection.release();
    return response(baseResponse.SUCCESS);
};
export const createReplyReport = async(user_id, defaultInfo, reason) => {
    // user가 존재하는지 체크
    const userExist = await userIdCheck(user_id);
    if (!userExist[0][0]) {
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);
    }
    // reply가 존재하는지 체크
    const replyExist = await replyIdCheck(defaultInfo.reply_id);
    if (!replyExist[0][0]) {
        return errResponse(baseResponse.REPLY_REPLYID_NOT_EXIST);
    }
    // 본인이 본인을 신고하는 경우를 체크
    if(user_id === replyExist[0][0].user_id)
        return errResponse(baseResponse.REPORT_NOT_REPORT_OWNSELF);
    // 이미 신고 한 적이 있는지 체크
    const beforeReport = await reportCheck(user_id, defaultInfo.reply_id, 2);
    if (beforeReport[0][0])
        return errResponse(baseResponse.REPORT_REPLY_ALREADY_EXIST);
    const connection = await pool.getConnection(async (conn) => conn);
    await insertReplyReport(connection, [
        defaultInfo.reply_id,
        user_id,
        reason[0],
        reason[1],
        reason[2],
        reason[3],
        defaultInfo.contents,
    ]);
    await updateReplyReportCount(connection, defaultInfo.reply_id);


    if (defaultInfo.is_blocked === 1) {
        await createUserBlock(replyExist[0][0].user_id, user_id);
    }
    connection.release();
    return response(baseResponse.SUCCESS);
};