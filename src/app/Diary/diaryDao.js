import {connect} from "pm2";

export const selectDiaryListById = async (connection, user_id) => {
            const selectDiaryListByIdQuery = `
      SELECT id, title, updated_at FROM diary
      WHERE user_id = ?
      ORDER BY updated_at DESC;`;
            const diaryListRow = await connection.query(selectDiaryListByIdQuery, user_id);
            return diaryListRow;
};

export const selectDiarybyId = async (connetion, diary_id) => {
    const selectDiarybyIdQuery = `
  SELECT * FROM diary WHERE id = ?;`;

    const diaryRows = await connetion.query(selectDiarybyIdQuery, diary_id);
    return diaryRows;
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

export const insertHashtag = async (connection, params) => {
    const insertHashtagQuery = `
        INSERT INTO diary_hashtag(diary_id, tag)
        VALUES (?, ?);`;
    const insertHashtagRows = await connection.query(insertHashtagQuery, params);
    return insertHashtagRows;
};

export const insertExtra = async (connection, params) => {
    const insertExtraQuery = `
    INSERT INTO diary(is_public, is_temporary)
    VALUES (? ,?);`;
    const insertExtraRows = await connection.query(insertExtraQuery, params);
    return insertExtraRows;
}