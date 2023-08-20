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
  createScrap,
  createPlannerReport,
  modifyChecklist,
  deleteUploadPlanner,
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
  const { plannerId, type } = req.query;
  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  if (!plannerId)
    return res.send(errResponse(baseResponse.PLANNER_PLANNERID_EMPTY));
  if (!(type === '0' || type === '1'))
    return res.send(errResponse(baseResponse.PLANNER_TYPE_WRONG));
  const deletePlannerResponse = await deletePlannerCheck(
    user_id,
    plannerId,
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
  // 빈 여행계획서 아이디 체크
  if (!defaultInfo.planner_id)
    return res.send(errResponse(baseResponse.PLANNER_PLANNERID_EMPTY));
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

export const postScrap = async (req, res) => {
  const { planner_id } = req.body;
  const user_id = req.verifiedToken.id;

  // 아이디 체크
  if (!user_id)
    return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
  // 여행계획서 아이디 체크
  if (!planner_id)
    return res.send(errResponse(baseResponse.PLANNER_PLANNERID_EMPTY));

  const postScrapResponse = await createScrap(user_id, planner_id);
  return res.send(postScrapResponse);
};

export const postPlannerReport = async (req, res) => {
  const reason = [
    req.body.reason_1,
    req.body.reason_2,
    req.body.reason_3,
    req.body.reason_4,
  ];
  const defaultInfo = {
    planner_id: req.body.planner_id,
    contents: req.body.contents,
    is_blocked: req.body.is_blocked,
  };
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 여행계획서 아이디 체크
  if (!defaultInfo.planner_id)
    return res.send(errResponse(baseResponse.PLANNER_PLANNERID_EMPTY));
  // reason 유무 체크
  let cnt = 0;
  for (let i = 0; i < 4; i++) {
    if (reason[i] !== 0 && reason[i] !== 1) {
      return res.send(errResponse(baseResponse.REPORT_REASON_IS_INVALID));
    }
    if (reason[i] === 0) cnt++;
  }
  // reason이 모두 0일 때
  if (cnt === 4)
    return res.send(errResponse(baseResponse.REPORT_REASON_NOT_CHECKED));
  // contents만 입력되었을 때
  if (reason[3] === 0 && defaultInfo.contents)
    return res.send(errResponse(baseResponse.REPORT_CONTENTS_CANT_BE_WRITTEN));
  // is_blocked 체크
  if (defaultInfo.is_blocked !== 0 && defaultInfo.is_blocked !== 1)
    return res.send(errResponse(baseResponse.REPORT_BLOCK_INVALID));

  const createPlannerReportResult = await createPlannerReport(
    user_id,
    defaultInfo,
    reason
  );
  return res.send(createPlannerReportResult);
};

export const putChecklist = async (req, res) => {
  const { checklist } = req.body;

  // 체크리스트 정보 체크
  if (!checklist)
    return res.send(errResponse(baseResponse.PLANNER_CHECKLIST_EMPTY));
  for (let i = 0; i < checklist.length; i++) {
    if (
      !checklist[i].id ||
      !checklist[i].contents ||
      !(checklist[i].is_checked === 0 || checklist[i].is_checked === 1)
    ) {
      return res.send(errResponse(baseResponse.PLANNER_CHECKLIST_INVALID));
    }
  }

  const putChecklistResponse = await modifyChecklist(checklist);
  return res.send(putChecklistResponse);
};

export const deleteUpload = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const { diaryId } = req.query;

  // 유저 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 다이어리 아이디 체크
  if (!diaryId) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));

  const deleteUploadResponse = await deleteUploadPlanner(user_id, diaryId);
  return res.send(deleteUploadResponse);
};
