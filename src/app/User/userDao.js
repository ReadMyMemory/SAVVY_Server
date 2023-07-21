export const selectUserbyId = async (connetion, id) => {
  const selectUserbyIdQuery = `
  SELECT * FROM user WHERE id = ?;`;

  const userRows = await connetion.query(selectUserbyIdQuery, id);
  return userRows;
};

export const selectUserKakaoId = async (connetion, kakao_id) => {
  const selectUserKakaoIdQuery = `
  SELECT * FROM user WHERE kakao_id = ?;`;

  const kakaoIdRow = await connetion.query(selectUserKakaoIdQuery, kakao_id);
  return kakaoIdRow;
};

export const insertUserInfo = async (connection, params) => {
  const insertUserInfoQuery = `
  INSERT INTO user (kakao_id, pic_url, nickname, intro)
  VALUES (?, ?, ?, ?);`;

  const insertUserInfoRow = await connection.query(insertUserInfoQuery, params);
  return insertUserInfoRow;
};
