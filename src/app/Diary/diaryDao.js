export const selectDiaryListById = async (connection, user_id) => {
            const selectDiaryListByIdQuery = `
      SELECT id, title, updated_at FROM diary
      WHERE user_id = ?
      ORDER BY updated_at DESC;`;
            const diaryListRow = await connection.query(selectDiaryListByIdQuery, user_id);
            return diaryListRow;
};