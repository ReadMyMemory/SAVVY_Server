const dotenv = require('dotenv').config();
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        console.log(accessToken);
        console.log(refreshToken);
        done(null, profile.id);
      }
    )
  );
};
