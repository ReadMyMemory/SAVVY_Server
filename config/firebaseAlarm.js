import admin from 'firebase-admin';
import baseResponse from './baseResponseStatus';
import { response, errResponse } from './response';
const serviceAccount = require('../savvy-392315-firebase-adminsdk-ojqc6-2994b3a065.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// push 기능 구현
export const pushAlarm = async (deviceToken, alarmContent) => {
  console.log(deviceToken);
  const message = {
    notification: {
      title: alarmContent.title,
      body: alarmContent.body,
    },
    data: {
      title: alarmContent.title,
      body: alarmContent.body,
    },
    android: {
      priority: 'high',
      //   notification: {
      //     title: alarmContent.title,
      //     body: alarmContent.body,
      //     sound: 'default',
      //     priority: 'high',
      //     imageUrl:
      //       'https://savvybucket.s3.ap-northeast-2.amazonaws.com/1690730876044_%EB%A1%9C%EA%B3%A0.png',
      //     channelId: '500',
      //   },
    },
    token: deviceToken,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(`Successfully sent message::`, response);
      return 'Success';
    })
    .catch((err) => {
      console.log(`Error Sending message.`, err);
      return errResponse(baseResponse.ALARM_ERROR);
    });
};
