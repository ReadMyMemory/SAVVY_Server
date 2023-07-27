import {connect} from "pm2";

export const selectDiaryListById = async (connection, user_id) => {
            const selectDiaryListByIdQuery = `
      SELECT id, title, updated_at, likes_count, comments_count, thumbnail, img_count FROM diary
      WHERE user_id = ?
      ORDER BY updated_at DESC;`;
            const diaryListRow = await connection.query(selectDiaryListByIdQuery, user_id);
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

    const selectUserbyDiaryIdRows = await connection.query(selectUserbyDiaryIdQuery, diary_id);
    return selectUserbyDiaryIdRows;
};

export const selectDiaryId = async (connection, user_id) => {
    const selectDiaryIdQuery = `
  SELECT id FROM diary WHERE user_id = ?
  ORDER BY updated_at DESC
  LIMIT 1;`;

    const selectDiaryIdRow = await connection.query(
        selectDiaryIdQuery,
        user_id
    );
    return selectDiaryIdRow;
};

export const insertDiary = async (connection, params) => {
    const insertDiaryQuery = `
        INSERT INTO diary (title, user_id, planner_id, is_public, is_temporary)
        VALUES (?, ?, ?, ?, ?);`;

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

    const insertThumbnailRows = await connection.query(insertThumbnailQuery, params);
    return insertThumbnailRows;
};

export const insertImgCount = async(connection, params) => {
    const insertImgCountQuery = `
    UPDATE diary
    SET img_count = (SELECT COUNT(*)
                     FROM diary_content
                     WHERE diary_id = ? AND type = 'image')
    WHERE id = ?;`;

    const insertImgCountRows = await connection.query(insertImgCountQuery, params);
    return insertImgCountRows;

}


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
    SET title = ?, planner_id = ?, is_temporary = ?
    WHERE id = ?;`;
    const updateDefaultRows = await connection.query(updateDefaultQuery, params);
    return updateDefaultRows;
};

export const deleteContent = async (connection, diary_id) => {
    const deleteContentQuery = `
    DELETE 
    FROM diary_content 
    WHERE diary_id = ?;`;
    const deleteContentRows = await connection.query(deleteContentQuery, diary_id);
    return deleteContentRows;
};
// 해시태그도 content와 비슷하게 갈 거 같다.
// 삭제 후 다시 작성하는 방식.
export const deleteHashtag = async (connection, diary_id) => {
    const deleteHashtagQuery = `
    DELETE
    FROM diary_hashtag
    WHERE diary_id = ?;`;
    const deleteHashtagRows = await connection.query(deleteHashtagQuery, diary_id);
    return  deleteHashtagRows;
};

// 다른 데이터는 cascade 옵션으로 다같이 삭제될거다.
// 다만 soft delete 하면 달라질지도?
export const deleteDiarybyId = async (connection, diary_id) => {
    const deleteDiarybyIdQuery = `
    DELETE
    FROM diary
    WHERE id = ?;`;
    const deleteDiarybyIdRows = await connection.query(deleteDiarybyIdQuery, diary_id);
    return deleteDiarybyIdRows;
};

export const selectDiaryDefault = async (connection, diary_id) => {
    const selectDiaryDefaultQuery = `
    SELECT diary.user_id, user.nickname, diary.updated_at,
           diary.likes_count, diary.comments_count, diary.planner_id
    FROM diary
    INNER JOIN user
    ON diary.user_id = user.id
    WHERE diary.id = ? ;`;

    const selectDiaryDefaultRows = await connection.query(selectDiaryDefaultQuery, diary_id);
    return selectDiaryDefaultRows;
};

export const selectDiaryContent = async (connection, diary_id) => {
    const selectDiaryContentQuery = `
    SELECT count, type, content, location
    FROM diary_content
    WHERE diary_id = ? ;`;

    const selectDiaryContentRows = await connection.query(selectDiaryContentQuery, diary_id);
    return selectDiaryContentRows;
};

export const selectDiaryHashtag = async (connection, diary_id) => {
    const selectDiaryHashtagQuery = `
    SELECT tag
    FROM diary_hashtag
    WHERE diary_id = ? ;`;

    const selectDiaryHashtagRows = await connection.query(selectDiaryHashtagQuery, diary_id);
    return selectDiaryHashtagRows;
};

export const selectDiaryTitle = async (connection, diary_id) => {
    const selectDiaryTitleQuery = `
    SELECT title
    FROM diary
    WHERE id = ? ;`;

    const selectDiaryTitleRows = await connection.query(selectDiaryTitleQuery, diary_id);
    return selectDiaryTitleRows;
};