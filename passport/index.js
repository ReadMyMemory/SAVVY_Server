import passport from 'passport';
import pool from '../config/database';
const kakao = require('./kakaoStrategy');

module.exports = () => {
  passport.serializeUser((data, done) => {
    console.log('시리얼라이즈 유저', data); // user는 tokenUser
    done(null, {
      id: data.user.id,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  });

  passport.deserializeUser(async (user, done) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM user WHERE id = ?', [
        user.id,
      ]);
      connection.release();

      const result = rows[0];
      done(null, {
        user: result,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    } catch (error) {
      done(error);
    }
  });
  kakao();
};
