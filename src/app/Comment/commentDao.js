import { connect } from 'pm2';

export const insertComment = async (connection, params) => {
  const insertCommentQuery = `
    INSERT INTO diary_comment(diary_id, user_id, content)
    VALUES (?, ?, ?) ;`;

  const insertCommentRows = await connection.query(insertCommentQuery, params);
  return insertCommentRows;
};

export const insertReply = async (connection, params) => {
  const insertReplyQuery = `
    INSERT INTO diary_reply(comment_id, user_id, content)
    VALUES (?, ?, ?) ;`;

  const insertReplyRows = await connection.query(insertReplyQuery, params);
  return insertReplyRows;
};

export const selectCommentbyId = async (connection, comment_id) => {
  const selectCommentbyIdQuery = `
    SELECT *
    FROM diary_comment
    WHERE id = ?;`;

  const selectCommentbyIdRows = await connection.query(
    selectCommentbyIdQuery,
    comment_id
  );
  return selectCommentbyIdRows;
};

export const selectCommentListbyId = async (connection, params) => {
  const selectCommentListbyIdQuery = `
    SELECT diary_comment.id, user.nickname, user.pic_url, 
    diary_comment.content,
    diary_comment.updated_at,
    is_updated
    FROM diary_comment
    INNER JOIN user
    ON diary_comment.user_id = user.id
    WHERE diary_id = ? AND 
    NOT diary_comment.user_id IN (SELECT blocked_user FROM user_blocked WHERE user_id = ?)
    ORDER BY diary_comment.updated_at DESC
    ;`;

  const selectCommentListbyIdRows = await connection.query(
    selectCommentListbyIdQuery,
    params
  );
  return selectCommentListbyIdRows;
};

export const selectReplyListbyId = async (connection, params) => {
  const selectReplyListbyIdQuery = `
    SELECT diary_reply.id, user.nickname, user.pic_url,
    diary_reply.content,
    diary_reply.updated_at,
    is_updated
    from diary_reply
    INNER JOIN user
    ON diary_reply.user_id = user.id
    WHERE comment_id = ? AND
    NOT diary_reply.user_id IN (SELECT blocked_user FROM user_blocked WHERE user_id = ?)
    ORDER BY diary_reply.updated_at DESC
    ;`;


  const selectReplyListbyIdRows = await connection.query(
    selectReplyListbyIdQuery,
    params
  );
  return selectReplyListbyIdRows;
};

export const showReplyCountbyId = async (connection, value) => {
  const showReplyCountbyIdQuery = `
  SELECT COUNT(id) AS count
  FROM diary_reply
  WHERE comment_id = ? ;`;

  const showReplyCountbyIdRows = await connection.query(showReplyCountbyIdQuery, value);
  return showReplyCountbyIdRows;
};

export const selectReplybyId = async (connection, reply_id) => {
  const selectReplybyIdQuery = `
  SELECT *
  FROM diary_reply
  WHERE id = ? ;`;

  const selectReplybyIdRows = await connection.query(selectReplybyIdQuery, reply_id);
  return selectReplybyIdRows;
};

export const updateComment = async (connection, params) => {
  const updateCommentQuery = `
  UPDATE diary_comment
  SET content = ?, is_updated = 'true'
  WHERE id = ? ;`;

  const updateCommentRows = await connection.query(updateCommentQuery, params);
  return updateCommentRows;
};

export const updateReply = async (connection, params) => {
  const updateReplyQuery = `
  UPDATE diary_reply
  SET content = ?, is_updated = 'true'
  WHERE id = ? ;`;

  const updateReplyRows = await connection.query(updateReplyQuery, params);
  return updateReplyRows;
};

export const deleteComment = async (connection, comment_id) => {
  const deleteCommentQuery = `
  DELETE 
  FROM diary_comment
  WHERE id = ? ;`;

  const deleteCommentRows = await connection.query(deleteCommentQuery, comment_id);
  return deleteCommentRows;
};

export const deleteReply = async (connection, reply_id) => {
  const deleteReplyQuery = `
  DELETE
  FROM diary_reply
  WHERE id = ? ;`;

  const deleteReplyRows = await connection.query(deleteReplyQuery, reply_id);
  return deleteReplyRows;
}

export const selectCommentReported = async(connection, params) => {
  const selectCommentReportedQuery = `
  SELECT * FROM diary_comment_report
  WHERE user_id = ? AND comment_id = ? ;`;

  const selectCommentReportedRows = await connection.query(selectCommentReportedQuery, params);
  return selectCommentReportedRows;
};

export const selectReplyReported = async(connection, params) => {
  const selectReplyReportedQuery = `
  SELECT * FROM diary_reply_report
  WHERE user_id = ? AND reply_id = ? ;`;

  const selectReplyReportedRows = await connection.query(selectReplyReportedQuery, params);
  return selectReplyReportedRows;
};

export const insertCommentReport = async(connection, params) => {
  const insertCommentReportQuery = `
  INSERT INTO diary_comment_report
  (comment_id, user_id, reason_1, reason_2, reason_3, reason_4, contents)
  VALUES (?, ?, ?, ?, ?, ?, ?) ;`;

  const insertCommentReportRows = await connection.query(insertCommentReportQuery, params);
  return insertCommentReportRows;
};

export const insertReplyReport = async(connection, params) => {
  const insertReplyReportQuery = `
  INSERT INTO diary_reply_report
  (reply_id, user_id, reason_1, reason_2, reason_3, reason_4, contents)
  VALUES (?, ?, ?, ?, ?, ?, ?) ;`;

  const insertReplyReportRows = await connection.query(insertReplyReportQuery, params);
  return insertReplyReportRows;
}

export const updateCommentReportCount = async (connection, comment_id) => {
  const updateCommentReportCountQuery = `
  UPDATE diary_comment SET report_count = report_count + 1
  WHERE id = ? ;`;

  const updateCommentReportCountRows = await connection.query(updateCommentReportCountQuery, comment_id);
  return updateCommentReportCountRows;
};

export const updateReplyReportCount = async(connection, reply_id) => {
  const updateReplyReportCountQuery = `
  UPDATE diary_reply SET report_count = report_count + 1
  WHERE id = ? ;`;

  const updateReplyReportCountRows = await connection.query(updateReplyReportCountQuery, reply_id);
  return updateReplyReportCountRows;
};

export const insertCommentCount = async(connection, diary_id) => {
  const insertCommentCountQuery = `
  UPDATE diary
  SET comments_count = comments_count + 1
  WHERE id = ?  ;`;

  const insertCommentCountRows = await connection.query(insertCommentCountQuery, diary_id);
  return insertCommentCountRows;
};

export const deleteCommentCount = async(connection, diary_id) => {
  const deleteCommentCountQuery = `
  UPDATE diary
  SET comments_count = comments_count - 1
  WHERE id = ?  ;`;

  const deleteCommentCountRows = await connection.query(deleteCommentCountQuery, diary_id);
  return deleteCommentCountRows;
};