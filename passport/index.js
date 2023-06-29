import passport from 'passport';
import pool from '../config/database';
const kakao = require('./kakaoStrategy');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM user WHERE id = ?', [
        id,
      ]);
      connection.release();

      const user = rows[0];
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  kakao();
};
