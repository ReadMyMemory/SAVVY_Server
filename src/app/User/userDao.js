export const selectUserbyId = async (connetion, id) => {
  const selectUserbyIdQuery = `
  SELECT * FROM user WHERE id = ?;`;

  const userRows = await connetion.query(selectUserbyIdQuery, id);
  return userRows;
};
