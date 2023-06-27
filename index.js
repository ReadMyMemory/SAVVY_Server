import dotenv from 'dotenv';
import app from './config/express';

dotenv.config();

app.listen(process.env.SERVER_PORT, () =>
  console.log(`server is ready on Port ${process.env.SERVER_PORT}`)
);
