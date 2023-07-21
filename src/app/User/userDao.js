export const selectUserLoginId = async (connection, id) => {
  const selectUserLoginIdQuery = `
    SELECT user_login_id, user_nickname
    FROM user
    WHERE user_login_id = ?;`;

  const [loginIdRows] = await connection.query(selectUserLoginIdQuery, id);
  return loginIdRows;
};

export const insertUserInfo = async (connection, insertUserInfoParams) => {
  const insertUserInfoQuery = `
  INSERT INTO user(user_login_id, user_login_pw, user_pic_url, user_nickname, user_intro)
  VALUES (?, ?, ?);`;

  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
};
