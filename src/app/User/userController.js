import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import { createUser } from './userService';

export const loginUser = async (req, res) => {
  const { accessToken } = req.body;
  // 빈 토큰 체크
  if (!accessToken)
    return res.send(errResponse(baseResponse.TOKEN_KAKAO_EMPTY));

  const loginUserResponse = await retrieveKakaoLogin(accessToken);
  return res.send(loginUserResponse);
};

// 1. 회원가입
export const postUser = async (req, res) => {
  const { id, password, image, nickname, intro } = req.body;

  // 빈 아이디 체크
  if (!id) return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));

  // 길이 체크
  if (id.length > 45)
    return res.send(response(baseResponse.SIGNIN_EMAIL_LENGTH));

  const signUpResponse = await createUser(id, password, image, nickname, intro);

  return res.send(response(signUpResponse));
};
