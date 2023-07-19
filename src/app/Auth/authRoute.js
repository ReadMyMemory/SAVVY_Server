import express from 'express';
import passport from 'passport';
const axios = require('axios');
const passportindex = require('../../../passport/index');
const authRouter = express.Router();

passportindex();

authRouter.get('/kakao', passport.authenticate('kakao'));

authRouter.get(
  '/kakao/callback',
  //? 그리고 passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  passport.authenticate('kakao', {
    failureRedirect: '/', // kakaoStrategy에서 실패한다면 실행
  }),
  // kakaoStrategy에서 성공한다면 콜백 실행
  (req, res) => {
    res.redirect('/login-success');
  }
);

authRouter.get('/kakao/logout', async (req, res) => {
  try {
    const ACCESS_TOKEN = req.session.passport.tokenUser;
    const logout = await axios({
      method: 'post',
      url: 'https://kapi.kakao.com/v1/user/unlink',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
  // req.logout();
  // req.session.destroy();

  // res.redirect('/');
});

export default authRouter;
