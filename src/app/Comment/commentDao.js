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

export const selectCommentbyId = async (connection, comment_id) => {
    const selectCommentbyIdQuery = `
    SELECT *
    FROM diary_comments
    WHERE id = ?;`;

    const selectCommentbyIdRows = await connection.query(selectCommentbyIdQuery, comment_id);
    return selectCommentbyIdRows;
}


export const selectCommentListById = async (connection, params) => {
    const selectCommentListbyIdQuery = `
    SELECT diary_comments.id, user.nickname, user.pic_url, 
    diary_comments.contents
    from diary_comments
    INNER JOIN user
    ON diary_comments.user_id = user.id
    WHERE diary_id = ? AND 
    NOT diary_comments.user_id IN (SELECT blocker_id FROM user_blocks WHERE user_id = ?) ;`;

    const selectCommentListbyIdRows = await connection.query(selectCommentListbyIdQuery, params);
    return selectCommentListbyIdRows;
} 

export const selectReplyListbyId = async (connection, params) => {
    const selectReplyListbyIdQuery = `
    SELECT diary_reply.id, user.nickname, user.pic_url,
    diary_reply.contents
    from diary_reply
    INNER JOIN user
    ON diary_reply.user_id = user.id
    WHERE comment_id = ? AND
    NOT diary_reply.user_id IN (SELECT blocker_id FROM user_blocks WHERE user_id = ?) ;`;
    
    const selectReplyListbyIdRows = await connection.query(selectReplyListbyIdQuery, params);
    return selectReplyListbyIdRows;
}