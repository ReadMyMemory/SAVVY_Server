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
