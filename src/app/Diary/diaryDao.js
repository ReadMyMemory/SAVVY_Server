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

