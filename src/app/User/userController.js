import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import { createUser } from './userService';

// 0. 테스트 API
export const getTest = async (req, res) => {
  return res.send(response(baseResponse.SUCCESS));
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

  return res.send(signUpResponse);
};
