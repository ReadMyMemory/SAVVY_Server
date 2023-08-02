import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import { userIdCheck } from '../User/userProvider';
import baseResponse from '../../../config/baseResponseStatus';
import { createSearchHistory } from './searchingService';
import {
  selectDiarySearch,
  selectHashtag,
  selectUserSearch,
  selectDiaryHistory,
} from './searchingDao';

export const retrieveDiarySearch = async (user_id, search_word) => {
  // 검색기록 저장
  const HistoryResult = await createSearchHistory(user_id, search_word, 0);
  if (!HistoryResult[0].insertId)
    return errResponse(baseResponse.SEARCHING_HISTORY_INSERT_ERROR);

  // 유저 정보 확인
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  // 다이어리 기본 정보
  const selectDiarySearchResult = await selectDiarySearch(connection, [
    user_id,
    search_word,
  ]);
  if (!selectDiarySearchResult[0][0])
    return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);

  // 해시태그 가져오기
  for (let i = 0; i < selectDiarySearchResult[0].length; i++) {
    const selectHashtagResult = await selectHashtag(
      connection,
      selectDiarySearchResult[0][i].id
    );
    if (!selectHashtagResult[0][0]) {
      selectDiarySearchResult[0][i].hashtag = null;
    } else {
      selectDiarySearchResult[0][i].hashtag = selectHashtagResult[0];
    }
  }

  connection.release();

  return response(baseResponse.SUCCESS, selectDiarySearchResult[0]);
};

export const retrieveUserSearch = async (user_id, search_word) => {
  // 검색기록 저장
  const HistoryResult = await createSearchHistory(user_id, search_word, 1);
  if (!HistoryResult[0].insertId)
    return errResponse(baseResponse.SEARCHING_HISTORY_INSERT_ERROR);

  // 유저 존재 체크
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  // 유저 검색 목록
  const selectUserSearchResult = await selectUserSearch(connection, [
    user_id,
    search_word,
  ]);
  connection.release();

  if (!selectUserSearchResult[0][0])
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  return response(baseResponse.SUCCESS, selectUserSearchResult[0]);
};

export const retrieveDiaryHistory = async (user_id, is_user) => {
  // 유저 존재 체크
  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0]) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  const connection = await pool.getConnection(async (conn) => conn);
  const selectDiaryHistoryResult = await selectDiaryHistory(
    connection,
    user_id
  );

  connection.release();
  // 검색기록 오류 체크
  if (!selectDiaryHistoryResult[0][0])
    return errResponse(baseResponse.SEARCHING_HISTORY_NOT_EXIST);
  return response(baseResponse.SUCCESS, selectDiaryHistoryResult[0]);
};
