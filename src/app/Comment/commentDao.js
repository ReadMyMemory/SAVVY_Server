import {connect} from "pm2";

export const insertComment = async (connection, params) => {
    const insertCommentQuery = `
    INSERT INTO diary_comments(diary_id, user_id, contents)
    VALUES (?, ?, ?) ;`;

    const insertCommentRows = await connection.query(insertCommentQuery, params);
    return insertCommentRows;
}

export const insertReply = async (connection, params) => {
    const insertReplyQuery = `
    INSERT INTO diary_reply(comment_id, user_id, contents)
    VALUES (?, ?, ?) ;`;
    
    const insertReplyRows = await connection.query(insertReplyQuery, params);
    return insertReplyRows;
}