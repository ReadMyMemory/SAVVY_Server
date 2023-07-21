import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import baseResponse from './baseResponseStatus';
import { response, errResponse } from './response';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

export const jwtMiddleware = (req, res, next) => {
  const token =
    req.headers['x-access-token'] ||
    req.headers['authorization'] ||
    req.query.token;
  if (!token) return res.send(errResponse(baseResponse.TOKEN_EMPTY));

  // 비동기 작업을 처리해주는 Promise 생성
  const p = new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, verifiedToken) => {
      if (err) reject(err);
      resolve(verifiedToken);
    });
  });

  // 토큰 유효성 검사 실패시 실행할 함수
  const onError = (error) => {
    res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
  };

  // 검증 과정
  p.then((verifiedToken) => {
    req.verifiedToken = verifiedToken;
    next();
  }).catch(onError);
};

// jwt 토큰 생성
export const generateToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: '365d',
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};
