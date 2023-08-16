import { connect } from 'pm2';

export const selectDiaryListById = async (connection, user_id) => {
  const selectDiaryListByIdQuery = `
      SELECT id, title, updated_at, likes_count, comments_count, thumbnail, img_count, is_public FROM diary
      WHERE user_id = ? AND is_temporary = 'false'
      ORDER BY updated_at DESC;`;
  const diaryListRow = await connection.query(
    selectDiaryListByIdQuery,
    user_id
  );
  return diaryListRow;
};

export const selectDiarybyId = async (connection, diary_id) => {
  const selectDiarybyIdQuery = `
  SELECT * 
  FROM diary 
  WHERE id = ?;`;

  const diaryRows = await connection.query(selectDiarybyIdQuery, diary_id);
  return diaryRows;
};

export const selectUserbyDiaryId = async (connection, diary_id) => {
  const selectUserbyDiaryIdQuery = `
    SELECT user_id
    FROM diary
    WHERE id = ?;`;

  const selectUserbyDiaryIdRows = await connection.query(
    selectUserbyDiaryIdQuery,
    diary_id
  );
  return selectUserbyDiaryIdRows;
};

export const selectDiaryId = async (connection, user_id) => {
  const selectDiaryIdQuery = `
  SELECT id FROM diary WHERE user_id = ?
  ORDER BY updated_at DESC
  LIMIT 1;`;

  const selectDiaryIdRow = await connection.query(selectDiaryIdQuery, user_id);
  return selectDiaryIdRow;
};

export const insertDiary = async (connection, params) => {
  const insertDiaryQuery = `
        INSERT INTO diary (user_id, planner_id, is_public, is_temporary)
        VALUES (?, ?, ?, ?);`;

  const insertDiaryRows = await connection.query(insertDiaryQuery, params);
  return insertDiaryRows;
};

// 테이블 생성 시
// count INT NOT NULL AUTO_INCREMENT, PRIMARY KEY (diary_id, count) 이런식으로 작성해야
// diary_id를 기준으로 1부터 AUTO_INCREMENT 적용됨.
export const insertContent = async (connection, params) => {
  const insertContentQuery = `
    INSERT INTO diary_content(diary_id, count, type, content, location)
    VALUES (?, ?, ?, ?, ?);`;

  const insertContentRows = await connection.query(insertContentQuery, params);
  return insertContentRows;
};

export const insertThumbnail = async (connection, params) => {
  const insertThumbnailQuery = `
UPDATE diary
SET thumbnail = ?
WHERE id = ?;`;

  const insertThumbnailRows = await connection.query(
    insertThumbnailQuery,
    params
  );
  return insertThumbnailRows;
};

export const insertImgCount = async (connection, params) => {
  const insertImgCountQuery = `
    UPDATE diary
    SET img_count = (SELECT COUNT(*)
                     FROM diary_content
                     WHERE diary_id = ? AND type = 'image')
    WHERE id = ?;`;

  const insertImgCountRows = await connection.query(
    insertImgCountQuery,
    params
  );
  return insertImgCountRows;
};

export const insertHashtag = async (connection, params) => {
  const insertHashtagQuery = `
        INSERT INTO diary_hashtag(diary_id, tag)
        VALUES (?, ?);`;
  const insertHashtagRows = await connection.query(insertHashtagQuery, params);
  return insertHashtagRows;
};

// 약간의 문제가 있는데, 일단 한번 만든 content 블록은 그대로 유지된다는 관점으로
// 위부터 순차적으로 데이터 변경을 하는 방식이다. 하지만 만약에 기존에 25블록을 쓰다가
// 20블럭을 쓰게 되면? 나머지 5블럭은 삭제되야 할 것이다.
// 이럴거면 차라리 update가 아니라 모든걸 삭제하고 다시 insert 하는 게 나은가?
// 일단 그렇게 짜고, 더 좋은 방법이 있으면 그쪽으로 수정.

export const updateDefault = async (connection, params) => {
  const updateDefaultQuery = `
    UPDATE diary
    SET title = ?
    WHERE id = ?;`;
  const updateDefaultRows = await connection.query(updateDefaultQuery, params);
  return updateDefaultRows;
};

export const deleteContent = async (connection, diary_id) => {
  const deleteContentQuery = `
    DELETE 
    FROM diary_content 
    WHERE diary_id = ?;`;
  const deleteContentRows = await connection.query(
    deleteContentQuery,
    diary_id
  );
  return deleteContentRows;
};
// 해시태그도 content와 비슷하게 갈 거 같다.
// 삭제 후 다시 작성하는 방식.
export const deleteHashtag = async (connection, diary_id) => {
  const deleteHashtagQuery = `
    DELETE
    FROM diary_hashtag
    WHERE diary_id = ?;`;
  const deleteHashtagRows = await connection.query(
    deleteHashtagQuery,
    diary_id
  );
  return deleteHashtagRows;
};

// 다른 데이터는 cascade 옵션으로 다같이 삭제될거다.
// 다만 soft delete 하면 달라질지도?
export const deleteDiarybyId = async (connection, diary_id) => {
  const deleteDiarybyIdQuery = `
    DELETE
    FROM diary
    WHERE id = ?;`;
  const deleteDiarybyIdRows = await connection.query(
    deleteDiarybyIdQuery,
    diary_id
  );
  return deleteDiarybyIdRows;
};

export const selectDiaryDefault = async (connection, diary_id) => {
  const selectDiaryDefaultQuery = `
    SELECT diary.user_id, user.nickname, user.pic_url, diary.updated_at,
           diary.likes_count, diary.comments_count, diary.planner_id,
           diary.title
    FROM diary
    INNER JOIN user
    ON diary.user_id = user.id
    WHERE diary.id = ? ;`;

  const selectDiaryDefaultRows = await connection.query(
    selectDiaryDefaultQuery,
    diary_id
  );
  return selectDiaryDefaultRows;
};

export const selectDiaryContent = async (connection, diary_id) => {
  const selectDiaryContentQuery = `
    SELECT count, type, content, location
    FROM diary_content
    WHERE diary_id = ? ;`;

  const selectDiaryContentRows = await connection.query(
    selectDiaryContentQuery,
    diary_id
  );
  return selectDiaryContentRows;
};

export const selectDiaryHashtag = async (connection, diary_id) => {
  const selectDiaryHashtagQuery = `
    SELECT tag
    FROM diary_hashtag
    WHERE diary_id = ? ;`;

  const selectDiaryHashtagRows = await connection.query(
    selectDiaryHashtagQuery,
    diary_id
  );
  return selectDiaryHashtagRows;
};

export const selectIsLiked = async (connection, params) => {
  const selectIsLikedQuery = `
    SELECT id
    FROM diary_likes
    WHERE user_id = ? AND diary_id = ? ;`;

  const selectIsLikedRows = await connection.query(selectIsLikedQuery, params);
  return selectIsLikedRows;
};

export const checkLikeCount = async (connection, diary_id) => {
  const checkLikeCountQuery = `
    SELECT likes_count
    FROM diary
    WHERE id = ? ;`;

  const checkLikeCountRows = await connection.query(
    checkLikeCountQuery,
    diary_id
  );
  return checkLikeCountRows;
};

export const upLikeCount = async (connection, diary_id) => {
  const upLikeCountQuery = `
    UPDATE diary
    SET likes_count = likes_count + 1
    WHERE id = ?
    ;`;

  const upLikeCountRows = await connection.query(upLikeCountQuery, diary_id);
  return upLikeCountRows;
};

export const downLikeCount = async (connection, diary_id) => {
  const downLikeCountQuery = `
    UPDATE diary
    SET likes_count = likes_count - 1
    WHERE id = ? ;`;

  const downLikeCountRows = await connection.query(
    downLikeCountQuery,
    diary_id
  );
  return downLikeCountRows;
};

export const insertLikeLog = async (connection, params) => {
  const insertLikeLogQuery = `
    INSERT INTO diary_likes(diary_id, user_id)
    VALUES (?, ?) ;`;

  const insertLikeLogRows = await connection.query(insertLikeLogQuery, params);
  return insertLikeLogRows;
};

export const deleteLikeLog = async (connection, params) => {
  const deleteLikeLogQuery = `
    DELETE 
    FROM diary_likes
    WHERE diary_id = ? && user_id = ? ;`;

  const deleteLikeLogRows = await connection.query(deleteLikeLogQuery, params);
  return deleteLikeLogRows;
};

export const updatePublicIsTrue = async (connection, diary_id) => {
  const updatePublicIsTrueQuery = `
    UPDATE diary
    SET is_public = 'true'
    WHERE id = ? ;`;

  const updatePublicIsTrueRows = await connection.query(
    updatePublicIsTrueQuery,
    diary_id
  );
  return updatePublicIsTrueRows;
};

export const updatePublicIsFalse = async (connection, diary_id) => {
  const updatePublicIsFalseQuery = `
    UPDATE diary
    SET is_public = 'false'
    WHERE id = ? ;`;

  const updatePublicIsFalseRows = await connection.query(
    updatePublicIsFalseQuery,
    diary_id
  );
  return updatePublicIsFalseRows;
};

export const checkIsLiked = async (connection, params) => {
  const checkIsLikedQuery = `
    SELECT *
    FROM diary_likes
    WHERE diary_id = ? AND user_id = ? ;`;

  const checkIsLikedRows = await connection.query(checkIsLikedQuery, params);
  return checkIsLikedRows;
};

export const checkPublicStatus = async (connection, diary_id) => {
  const checkPublicStatusQuery = `
    SELECT is_public
    FROM diary
    WHERE id = ? ;`;
  
  const checkPublicStatusRows = await connection.query(checkPublicStatusQuery, diary_id);
  return checkPublicStatusRows;
};

export const selectDiaryListPublic = async (connection, user_id) => {
  const selectDiaryListPublicQuery = `
  SELECT id, title, updated_at, likes_count, comments_count, thumbnail, img_count, is_public 
  FROM diary
  WHERE user_id = ? AND is_public = 'true' AND is_temporary = 'false'
  ORDER BY updated_at DESC;`;

  const selectDiaryListPublicRows = await connection.query(
    selectDiaryListPublicQuery,
    user_id
  );
  return selectDiaryListPublicRows;
};
    
export const selectHomeListdefault = async (connection, user_id) => {
    const selectHomeListdefaultQuery = `
    SELECT id, title, user_id, updated_at, likes_count, comments_count, thumbnail,
    likes_count, comments_count
    FROM diary
    WHERE user_id NOT IN (SELECT blocked_user FROM user_blocked WHERE user_id = ?) AND 
    is_public = 'true' AND is_temporary = 'false'
    ORDER BY updated_at DESC LIMIT 20;`;

    const selectHomeListdefaultRows = await connection.query(selectHomeListdefaultQuery, user_id);
    return selectHomeListdefaultRows;
}


export const selectHomeListbyId = async (connection, params) => {
    const selectHomeListbyIdQuery = ` 
    SELECT id, title, user_id, updated_at, likes_count, comments_count, thumbnail,
    likes_count, comments_count
    FROM diary
    WHERE updated_at < (SELECT updated_at FROM diary WHERE id = ?) AND
          user_id NOT IN (SELECT blocked_user FROM user_blocked WHERE user_id = ?) AND 
          is_public = 'true' AND is_temporary = 'false'
    ORDER BY updated_at DESC LIMIT 20;`;

    const selectHomeListbyIdRows = await connection.query(selectHomeListbyIdQuery, params);
    return selectHomeListbyIdRows;

}

export const findUserNickname = async (connection, user_id) => {
    const findUserNicknameQuery = ` 
    SELECT nickname
    FROM user
    WHERE id = ? ;`;

    const findUserNicknameRows = await connection.query(findUserNicknameQuery, user_id);
    return findUserNicknameRows;
};

export const selectDiaryReported = async(connection, params) => {
    const selectDiaryReportedQuery = `
    SELECT * FROM diary_report 
    WHERE user_id = ? AND diary_id = ? ;`;

    const selectDiaryReportedRows = await connection.query(selectDiaryReportedQuery, params);
    return selectDiaryReportedRows;
};

export const insertDiaryReport = async (connection, params) => {
    const insertDiaryReportQuery = `
        INSERT INTO diary_report
            (diary_id, user_id, reason_1, reason_2, reason_3, reason_4, contents)
        VALUES (?, ?, ?, ?, ?, ?, ?);`;

    const insertDiaryReportRows = await connection.query(insertDiaryReportQuery, params);
    return insertDiaryReportRows;
};

export const updateDiaryReportCount = async (connection, diary_id) => {
    const updateDiaryReportCountQuery = `
    UPDATE diary SET report_count = report_count + 1
    WHERE id = ? ;`;

    const updateDiaryReportCountRows = await connection.query(
        updateDiaryReportCountQuery,
        diary_id
    );
    return updateDiaryReportCountRows;
};

export const selectDiarySearch = async(connection, params) => {
  const search_word = '%' + params[1] + '%';
  const new_params = [
    params[0],
    search_word
  ];
  const selectDiarySearchQuery = `
  SELECT diary.id, title, diary.updated_at, nickname 
  FROM diary 
  INNER JOIN user 
  ON diary.user_id = user.id
  WHERE user_id = ? AND title LIKE ?
  ORDER BY updated_at DESC ;`;

  const selectDiarySearchRows = await connection.query(selectDiarySearchQuery, new_params);
  return selectDiarySearchRows;
};

export const updateUserLikeCountup = async(connection, user_id) => {
  const updateUserLikeCountupQuery = `
  UPDATE user
  SET likes = likes + 1
  WHERE id = ? ;`;

  const updateUserLikeCountupRows = await connection.query(updateUserLikeCountupQuery, user_id);
  return updateUserLikeCountupRows;
};

export const updateUserLikeCountdown = async(connection, user_id) => {
  const updateUserLikeCountdownQuery = `
  UPDATE user
  SET likes = likes - 1
  WHERE id = ? ;`;

  const updateUserLikeCountdownRows = await connection.query(updateUserLikeCountdownQuery, user_id);
  return updateUserLikeCountdownRows;
};

export const updateUserdiaryCountup = async(connection, user_id) => {
  const updateUserdiaryCountupQuery = `
  UPDATE user
  SET amount_diary = amount_diary + 1
  WHERE id = ? ;`;

  const updateUserdiaryCountupRows = await connection.query(updateUserdiaryCountupQuery, user_id);
  return updateUserdiaryCountupRows;
};

export const updateUserdiaryCountdown = async(connection, params) => {
  const updateUserdiaryCountdownQuery = `
  UPDATE user
  SET amount_diary = amount_diary - 1, likes = likes - ?
  WHERE id = ? ;`;

  const updateUserdiaryCountdownRows = await connection.query(updateUserdiaryCountdownQuery, params);
  return updateUserdiaryCountdownRows;
};

export const updateUserdiaryStatustrue = async(connection, params) => {
  const updateUserdiaryStatustrueQuery = `
  UPDATE user
  SET amount_diary = amount_diary + 1, likes = likes + ?
  WHERE id = ? ;`;

  const updateUserdiaryStatustrueRows = await connection.query(updateUserdiaryStatustrueQuery, params);
  return updateUserdiaryStatustrueRows;
};

export const updateUserdiaryStatusfalse = async(connection, params) => {
  const updateUserdiaryStatusfalseQuery = `
  UPDATE user
  SET amount_diary = amount_diary - 1, likes = likes - ?
  WHERE id = ? ;`;

  const updateUserdiaryStatusfalseRows = await connection.query(updateUserdiaryStatusfalseQuery, params);
  return updateUserdiaryStatusfalseRows;
};

export const insertTitle = async(connection, params) => {
  const insertTitleQuery = `
  UPDATE diary
  SET title = ?
  WHERE id = ? ;`;

  const insertTitleRows = await connection.query(insertTitleQuery, params);
  return insertTitleRows;
};
