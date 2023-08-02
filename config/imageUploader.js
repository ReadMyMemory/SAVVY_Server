import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

export const uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'savvybucket',
    key: (req, file, callback) => {
      const extension = path.extname(file.originalname);
      if (!allowedExtensions.includes(extension)) {
        return callback(new Error('wrong extension'));
      }
      callback(null, `${Date.now()}_${file.originalname}`);
    },
    acl: 'public-read-write',
  }),
});

