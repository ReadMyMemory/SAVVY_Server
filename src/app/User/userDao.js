export const selectUserbyId = async (connetion, id) => {
  const selectUserbyIdQuery = `
  SELECT * FROM user WHERE user_login_id = ?;`;

  const [userRows] = await connetion.query(selectUserbyIdQuery, id);
  return userRows;
};

export const insertUserInfo = async (connection, insertUserInfoParams) => {
  const insertUserInfoQuery = `
  INSERT INTO users (user_email, user_nickname, user_login_id) 
  VALUES (?, ?, ?)`;

  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  // return insertUserInfoRow;
};
