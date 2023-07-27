import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import { retrieveKakaoLogin } from './userProvider';
import { createUser } from './userService';

export const loginUser = async (req, res) => {
  const { kakaoToken } = req.body;
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
