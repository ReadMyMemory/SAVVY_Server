import { connect } from 'pm2';
import { getNicknameCheck } from './userController';

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

export const updateUserDiaryCount = async (connection, params) => {
  const updateUserDiaryCountQuery = `
  UPDATE user 
  SET likes = ?, amount_diary = ? 
  WHERE id = ?;`;

  const updateUserDiaryCountRow = await connection.query(
    updateUserDiaryCountQuery,
    params
  );
  return updateUserDiaryCountRow;
};

export const updateUserPlannerCount = async (connection, params) => {
  const updateUserPlannerCountQuery = `
  UPDATE user
  SET amount_planner = ?
  WHERE id = ?;`;

  const updateUserPlannerCountRow = await connection.query(
    updateUserPlannerCountQuery,
    params
  );
  return updateUserPlannerCountRow;
};

export const selectUserbyNickname = async (connection, nickname) => {
  const selectUserbyNicknameQuery = `
  SELECT * FROM user
  WHERE nickname = ?;`;

  const selectUserbyNicknameRows = await connection.query(
    selectUserbyNicknameQuery,
    nickname
  );
  return selectUserbyNicknameRows;
};
