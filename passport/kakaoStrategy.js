import dotenv from 'dotenv';
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
import pool from '../config/database';
import { selectUserbyId, insertUserInfo } from '../src/app/User/userDao';
dotenv.config();

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
          const connection = await pool.getConnection();
          const exUser = await selectUserbyId(connection, [profile.id])[0];
          connection.release();

          if (exUser) {
            console.log(exUser);
            const tokenUser = {
              user: exUser,
              accessToken: accessToken || '',
              refreshToken: refreshToken || '',
            };
            done(null, tokenUser);
          } else {
            const connection = await pool.getConnection();
            const insertUserInfoParams = [
              profile._json && profile._json.kakao_account_email,
              profile.displayName,
              profile.id,
            ];
            await insertUserInfo(connection, insertUserInfoParams);
            connection.release();

            const newUser = {
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.displayName,
              snsId: profile.id,
            };
            console.log(newUser);
            const tokenUser = {
              user: newUser,
              accessToken: accessToken || '',
              refreshToken: refreshToken || '',
            };
            done(null, tokenUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
