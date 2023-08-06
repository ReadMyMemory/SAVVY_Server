import { connect } from 'pm2';

export const selectDiarySearch = async (connection, params) => {
  const search_word = '%' + params[1] + '%';
  const new_params = [params[0], search_word, search_word, search_word];
  const selectDiarySearchQuery = `
  SELECT diary.id, title, nickname, DATE_FORMAT(diary.updated_at, '%Y.%m.%d') AS 'updated_at', diary.likes_count, comments_count, thumbnail, img_count, is_public
  FROM diary JOIN user ON diary.user_id = user.id
  WHERE is_public = 'true' AND user.id NOT IN (
    SELECT blocked_user FROM user_blocked
    WHERE user_id = ?)
  AND (title LIKE ? OR nickname LIKE ? OR diary.id IN (
    SELECT diary_id FROM diary_hashtag 
    WHERE tag LIKE ?))
  ORDER BY diary.updated_at DESC;`;

  const selectDiarySearchRows = await connection.query(
    selectDiarySearchQuery,
    new_params
  );
  return selectDiarySearchRows;
};

export const selectHashtag = async (connection, diary_id) => {
  const selectHashtagQuery = `
  SELECT tag FROM diary_hashtag
  WHERE diary_id = ?;`;

  const selectHashtagRows = await connection.query(
    selectHashtagQuery,
    diary_id
  );
  return selectHashtagRows;
};

export const selectUserSearch = async (connection, params) => {
  const new_params = [
    params[0],
    params[0],
    '%' + params[1] + '%',
    params[1],
    params[1] + '%',
    '%' + params[1] + '%',
    '%' + params[1],
  ];
  const selectUserSearchQuery = `
  SELECT id, nickname, pic_url, likes, amount_planner, amount_diary
  FROM user
  WHERE user.id NOT IN (
    SELECT blocked_user FROM user_blocked
    WHERE user_id = ?)
  AND id != ? AND nickname LIKE ?
  ORDER BY CASE WHEN nickname = ? then 0
    WHEN nickname = ? then 1
    WHEN nickname = ? then 2
    WHEN nickname = ? then 3
    ELSE 4
    END;`;

  const selectUserSearchRows = await connection.query(
    selectUserSearchQuery,
    new_params
  );
  return selectUserSearchRows;
};

export const insertSearchHistory = async (connection, params) => {
  const insertSearchHistoryQuery = `
  INSERT INTO searching_history (user_id, search_word, is_user)
  VALUES (?, ?, ?);`;

  const insertSearchHistoryRow = await connection.query(
    insertSearchHistoryQuery,
    params
  );
  return insertSearchHistoryRow;
};

export const selectDiaryHistory = async (connection, user_id) => {
  const selectSearchHistoryQuery = `
  SELECT search_word, searching_at FROM searching_history
    WHERE user_id = ? AND is_user = 0 AND (search_word, searching_at) IN (
      SELECT search_word, MAX(searching_at) AS 'searching_at'
      FROM searching_history WHERE is_user = 0 GROUP BY search_word)
    ORDER BY searching_at DESC
    LIMIT 10;`;

  const selectSearchHistoryRows = await connection.query(
    selectSearchHistoryQuery,
    user_id
  );
  return selectSearchHistoryRows;
};

export const selectUserHistory = async (connection, user_id) => {
  const selectUserHistoryQuery = `
  SELECT user.id, nickname, pic_url, likes, amount_planner, amount_diary, searching_at FROM searching_history
  JOIN user ON searching_history.search_word = user.nickname
    WHERE user_id = ? AND is_user = 1 AND (search_word, searching_at) IN (
      SELECT search_word, MAX(searching_at) AS 'searching_at'
      FROM searching_history WHERE is_user = 1 GROUP BY search_word)
    ORDER BY searching_at DESC
    LIMIT 10;`;

  const selectUserHistoryRows = await connection.query(
    selectUserHistoryQuery,
    user_id
  );
  return selectUserHistoryRows;
};

export const deleteSearchHistory = async (connection, params) => {
  const deleteSearchHistoryQuery = `
  DELETE FROM searching_history
  WHERE user_id = ? AND search_word = ? AND is_user = ?;`;

  const deleteSearchHistoryRow = await connection.query(
    deleteSearchHistoryQuery,
    params
  );
  return deleteSearchHistoryRow;
};

export const deleteSearchHistoryAll = async (connection, params) => {
  const deleteSearchHistoryAllQuery = `
  DELETE FROM searching_history
  WHERE user_id = ? AND is_user = ?;`;

  const deleteSearchHistoryAllRow = await connection.query(
    deleteSearchHistoryAllQuery,
    params
  );
  return deleteSearchHistoryAllRow;
};
