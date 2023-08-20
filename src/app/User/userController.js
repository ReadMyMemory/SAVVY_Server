import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
  retrieveKakaoLogin,
  userIdCheck,
  retrieveMypage,
  retrieveUserPage,
  retrieveMypageDiary,
  retrieveMypagePlanner,
  retrieveUserPageDiary,
  retrieveUserPagePlanner,
  retrieveUserNickname,
  retrieveUserBlockList,
  retrieveAlarmList,
  retrieveLikeList
} from './userProvider';
import {
  createUser,
  modifyProfile
} from './userService';
import { pushAlarm } from '../../../config/firebaseAlarm';

export const loginUser = async (req, res) => {
  const { kakaoToken, deviceToken } = req.body;
  // 빈 토큰 체크
  if (!kakaoToken) return res.send(errResponse(baseResponse.TOKEN_KAKAO_EMPTY));

  const loginUserResponse = await retrieveKakaoLogin(kakaoToken);
  return res.send(loginUserResponse);
};

export const postUser = async (req, res) => {
  const { kakaoToken, pic_url, nickname, intro } = req.body;

  // 빈 토큰 체크
  if (!kakaoToken) return res.send(errResponse(baseResponse.TOKEN_KAKAO_EMPTY));
  // 빈 닉네임 체크
  if (!nickname)
    return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));
  // 소개글 길이 체크
  if (intro.length > 300)
    return res.send(response(baseResponse.SIGNUP_INTRO_LENGTH));

  const signUpResponse = await createUser(kakaoToken, pic_url, nickname, intro);

  return res.send(signUpResponse);
};

export const loginTest = async (req, res) => {
  const user_id = req.verifiedToken.id;
  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const loginTestResult = await userIdCheck(user_id);
  if (!loginTestResult[0][0])
    return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
  return res.send(
    response(baseResponse.SUCCESS, {
      nickname: loginTestResult[0][0].nickname,
    })
  );
};

export const postProfileImage = async (req, res) => {
  if (!req.file) return res.send(errResponse(baseResponse.S3_ERROR));
  const filePath = req.file.location;

  if (!filePath) return res.send(errResponse(baseResponse.S3_ERROR));
  return res.send(response(baseResponse.SUCCESS, { pic_url: filePath }));
};

export const alarmTest = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const { user_alarmed } = req.params;

  const userExist = await userIdCheck(user_alarmed);
  if (!userExist[0][0])
    return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

  const alarmTestResponse = await pushAlarm(userExist[0][0].deviceToken, {
    title: '제목',
    body: '이건 내용이에요',
  });

  if (alarmTestResponse === errResponse(baseResponse.ALARM_ERROR))
    return res.send(errResponse(baseResponse.ALARM_ERROR));

  return res.send(response(baseResponse.SUCCESS));
};

export const getMypage = async (req, res) => {
  const user_id = req.verifiedToken.id;

  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0])
    return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

  const getMypageResponse = await retrieveMypage(user_id);
  return res.send(getMypageResponse);
};

export const getMypageDiary = async (req, res) => {
  const user_id = req.verifiedToken.id;

  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0])
    return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

  const getMypageDiaryResponse = await retrieveMypageDiary(user_id);
  return res.send(getMypageDiaryResponse);
};

export const getMypagePlanner = async (req, res) => {
  const user_id = req.verifiedToken.id;

  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0])
    return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

  const getMypagePlannerResponse = await retrieveMypagePlanner(user_id);
  return res.send(getMypagePlannerResponse);
};

export const getUserPage = async (req, res) => {
  const { userId, searching } = req.query;
  const my_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  if (!my_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const getUserPageResponse = await retrieveUserPage(userId, my_id, searching);
  return res.send(getUserPageResponse);
};

export const getUserPageDiary = async (req, res) => {
  const { userId } = req.query;
  const my_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  if (!my_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const getUserPageDiaryResponse = await retrieveUserPageDiary(userId);
  return res.send(getUserPageDiaryResponse);
};

export const getUserPagePlanner = async (req, res) => {
  const { userId } = req.query;
  const my_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  if (!my_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const getUserPagePlannerResponse = await retrieveUserPagePlanner(userId);
  return res.send(getUserPagePlannerResponse);
};

export const getNicknameCheck = async (req, res) => {
  const { nickname } = req.query;

  // 빈 닉네임 체크
  if (!nickname)
    return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));

  const getNicknameCheckResponse = await retrieveUserNickname(nickname);
  return res.send(getNicknameCheckResponse);
};

export const getUserBlockList = async (req, res) => {
  const user_id = req.verifiedToken.id;

  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0])
    return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

  const getUserBlockListResponse = await retrieveUserBlockList(user_id);
  return res.send(getUserBlockListResponse);
};

export const getAlarmList = async (req, res) => {
  const user_id = req.verifiedToken.id;

  const userExist = await userIdCheck(user_id);
  if (!userExist[0][0])
    return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

  const getAlarmListResponse = await retrieveAlarmList(user_id);
  return res.send(getAlarmListResponse);
};

export const putProfile = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const pic_url = req.body.pic_url;
  const nickname = req.body.nickname;
  const intro = req.body.intro;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 닉네임 체크
  if (!nickname)
    return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));
  // 소개글 길이 체크
  if (intro.length > 300)
    return res.send(response(baseResponse.SIGNUP_INTRO_LENGTH));

  const putProfileResponse = await modifyProfile(user_id, pic_url, nickname, intro);
  return res.send(putProfileResponse);
};

export const getMyLikeList = async(req, res) => {
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  const getMyLikeListResponse = await retrieveLikeList(user_id);
  return res.send(getMyLikeListResponse);
};
