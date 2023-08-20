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

export const updatePlannerCountUp = async (connection, user_id) => {
  const updatePlannerCountUpQuery = `
  UPDATE user SET amount_planner = amount_planner + 1
  WHERE id = ?;`;

  const updatePlannerCountUpRow = await connection.query(
    updatePlannerCountUpQuery,
    user_id
  );
  return updatePlannerCountUpRow;
};

export const updatePlannerCountDown = async (connection, user_id) => {
  const updatePlannerCountDownQuery = `
  UPDATE user SET amount_planner = amount_planner - 1
  WHERE id = ?;`;

  const updatePlannerCountDownRow = await connection.query(
    updatePlannerCountDownQuery,
    user_id
  );
  return updatePlannerCountDownRow;
};

export const selectUserBlockList = async (connection, user_id) => {
  const selectUserBlockListQuery = `
  SELECT blocked_user, nickname FROM user_blocked 
  JOIN user ON user_blocked.blocked_user = user.id
  WHERE user_id = ?
  ORDER BY user_blocked.blocked_at;`;

  const selectUserBlockListRows = await connection.query(
    selectUserBlockListQuery,
    user_id
  );
  return selectUserBlockListRows;
};

export const selectAlarmList = async (connection, user_id) => {
  const selectAlarmListQuery = `
  SELECT user_id, nickname, type, alarm_log.updated_at, read_status
  FROM alarm_log JOIN user ON alarm_log.user_id = user.id
  WHERE user_alarmed = ?
  ORDER BY alarm_log.updated_at DESC;`;

  const selectAlarmListRows = await connection.query(
    selectAlarmListQuery,
    user_id
  );
  return selectAlarmListRows;
};

export const modifyUserProfileImgEmpty = async (connection, params) => {
  const modifyUserProfileImgEmptyQuery = `
  UPDATE user
  SET pic_url = NULL, nickname = ?, intro = ?
  WHERE id = ? ;`;

  const modifyUserProfileImgEmptyRows = await connection.query(
      modifyUserProfileImgEmptyQuery,
      params
  );
  return modifyUserProfileImgEmptyRows;
};

export const modifyUserProfileImgExist = async(connection, params) => {
  const modifyUserProfileImgExistQuery = `
  UPDATE user
  SET pic_url = ?, nickname = ?, intro = ?
  WHERE id = ? ;`;

  const modifyUserProfileImgExistRows = await connection.query(
      modifyUserProfileImgExistQuery,
      params
  );
  return modifyUserProfileImgExistRows;
};