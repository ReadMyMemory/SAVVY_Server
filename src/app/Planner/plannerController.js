import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
  retrievePlannerList,
  retrievePlannerSearch,
  retrievePlannerdetail,
} from './plannerProvider';
import {
  deletePlannerCheck,
  createPlanner,
  modifyPlanner,
} from './plannerService';

export const getPlannerListAll = async (req, res) => {
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const getListResponse = await retrievePlannerList(user_id, 0);
  return res.send(getListResponse);
};

export const getPlannerList = async (req, res) => {
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const getListResponse = await retrievePlannerList(user_id, 1);
  return res.send(getListResponse);
};

export const getPlannerListScrap = async (req, res) => {
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const getListResponse = await retrievePlannerList(user_id, 2);
  return res.send(getListResponse);
};

export const deletePlanner = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const { planner_id, type } = req.body;
  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  if (!planner_id)
    return res.send(errResponse(baseResponse.PLANNER_PLANNERID_EMPTY));
  if (!(type === '0' || type === '1'))
    return res.send(errResponse(baseResponse.PLANNER_TYPE_WRONG));
  const deletePlannerResponse = await deletePlannerCheck(
    user_id,
    planner_id,
    type
  );
  return res.send(deletePlannerResponse);
};

export const postPlanner = async (req, res) => {
  // body를 "기본정보, 시간표 개수, 시간표" 3개로 나누어 다룬다
  // 시간표 안의 checklist는 Service단에서 해결
  // 3개로 나눈 정보를 서로 다른 Servcie 함수로 보낼지?
  // 기본정보 먼저 DB에 넣어놓고 시간표로 넘어와야 할듯?
  // planner_id를 먼저 받아오고 그걸 토대로 시간표 insert
  // 방금 만든 planner_id를 어떻게 알 수 있지?
  // user_id로 select해서 가장 최근꺼 가져오면 되나?
  // checklist는 2중 for문 돌리면 될거 같음
  // Controller에서 for문 돌려서 형식적 validation
  // 그러면 Controller에서부터 body 다 분해해야 되는데?
  const defaultInfo = {
    title: req.body.title,
    user_id: req.verifiedToken.id,
    memo: req.body.memo,
  };
  const timetableInfo = req.body.timetable;
  // return res.send(postPlannerBody.timetable[2].checklist);
  // 빈 아이디 체크
  if (!defaultInfo.user_id)
    return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 제목 길이 체크
  if (defaultInfo.title.length > 45)
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_TITLE_LENGTH));
  if (!defaultInfo.title) defaultInfo.title = '제목을 입력해주세요';
  if (!defaultInfo.memo) defaultInfo.memo = null;

  // 시간표 체크
  if (timetableInfo.length <= 0) {
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_TIMETABLE_EMPTY));
  }
  const postPlannerResponse = await createPlanner(
    defaultInfo,
    timetableInfo,
    0
  );
  return res.send(postPlannerResponse);
};

export const getPlannerSearch = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const { searchWord } = req.query;
  // 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 검색어 체크
  if (!searchWord)
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_EMPTY));
  // 검색어 길이 체크
  if (searchWord.length > 45)
    return res.send(
      errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_LENGTH)
    );
  const getPlannerSearchResponse = await retrievePlannerSearch(
    user_id,
    searchWord
  );
  return res.send(getPlannerSearchResponse);
};

export const putPlanner = async (req, res) => {
  const defaultInfo = {
    planner_id: req.body.id,
    title: req.body.title,
    user_id: req.verifiedToken.id,
    memo: req.body.memo,
  };
  const timetableInfo = req.body.timetable;
  // 빈 아이디 체크
  if (!defaultInfo.user_id)
    return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 제목 길이 체크
  if (defaultInfo.title.length > 45)
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_TITLE_LENGTH));
  if (!defaultInfo.title) defaultInfo.title = '제목을 입력해주세요';
  if (!defaultInfo.memo) defaultInfo.memo = null;

  // 시간표 체크
  if (timetableInfo.length <= 0) {
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_TIMETABLE_EMPTY));
  }
  const putPlannerResponse = await modifyPlanner(defaultInfo, timetableInfo);
  return res.send(putPlannerResponse);
};

export const getPlannerdetail = async (req, res) => {
  const { planner_id } = req.params;
  const user_id = req.verifiedToken.id;

  // 여행계획서 아이디 체크
  if (!planner_id)
    return res.send(errResponse(baseResponse.PLANNER_PLANNERID_EMPTY));

  const getPlannerdetailResponse = await retrievePlannerdetail(
    user_id,
    planner_id
  );
  return res.send(getPlannerdetailResponse);
};

export const postPlannerUpload = async (req, res) => {
  const defaultInfo = {
    title: req.body.title,
    user_id: req.verifiedToken.id,
    memo: req.body.memo,
  };
  const timetableInfo = req.body.timetable;
  // 빈 아이디 체크
  if (!defaultInfo.user_id)
    return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 제목 길이 체크
  if (defaultInfo.title.length > 45)
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_TITLE_LENGTH));
  if (!defaultInfo.title) defaultInfo.title = '제목을 입력해주세요';
  if (!defaultInfo.memo) defaultInfo.memo = null;

  // 시간표 체크
  if (timetableInfo.length <= 0) {
    return res.send(errResponse(baseResponse.PLANNER_PLANNER_TIMETABLE_EMPTY));
  }
  const postPlannerResponse = await createPlanner(
    defaultInfo,
    timetableInfo,
    1
  );
  return res.send(postPlannerResponse);
};
