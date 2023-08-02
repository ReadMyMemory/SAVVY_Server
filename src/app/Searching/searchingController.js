import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
  retrieveDiarySearch,
  retrieveUserSearch,
  retrieveDiaryHistory,
  retrieveUserHistory,
} from './searchingProvider';
import { deleteSearchList } from './searchingService';

export const getDiarySearch = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const { searchWord } = req.query;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 검색어 체크
  if (!searchWord)
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_EMPTY));
  // 검색어 길이 체크
  if (searchWord.length > 45)
    return res.send(
      errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_LENGTH)
    );

  const getDiarySearchResponse = await retrieveDiarySearch(user_id, searchWord);

  return res.send(getDiarySearchResponse);
};

export const getUserSearch = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const { searchWord } = req.query;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 검색어 체크
  if (!searchWord)
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_EMPTY));
  // 검색어 길이 체크
  if (searchWord.length > 18)
    return res.send(
      errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_LENGTH)
    );

  const getUserSearchResponse = await retrieveUserSearch(user_id, searchWord);

  return res.send(getUserSearchResponse);
};

export const getDiaryHistory = async (req, res) => {
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const getDiaryHistoryResponse = await retrieveDiaryHistory(user_id);
  return res.send(getDiaryHistoryResponse);
};

export const getUserHistory = async (req, res) => {
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const getUserHistoryResponse = await retrieveUserHistory(user_id);
  return res.send(getUserHistoryResponse);
};

export const deleteHistory = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const { searchWord, type } = req.query;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 검색어 체크
  if (!searchWord)
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_EMPTY));
  // 검색어 길이 체크
  if (searchWord.length > 45)
    return res.send(
      errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_LENGTH)
    );
  // type 값 체크
  if (type !== '0' && type !== '1') {
    return res.send(errResponse(baseResponse.PLANNER_TYPE_WRONG));
  }

  const deleteHistoryResponse = await deleteSearchList(
    user_id,
    searchWord,
    type
  );

  return res.send(deleteHistoryResponse);
};
