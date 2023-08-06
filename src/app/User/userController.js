import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
  retrieveKakaoLogin,
  userIdCheck,
  retrieveMypage,
} from './userProvider';
import { createUser } from './userService';
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
