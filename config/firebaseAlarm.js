import admin from 'firebase-admin';
import baseResponse from './baseResponseStatus';
import { response, errResponse } from './response';
const serviceAccount = require('../savvy-392315-firebase-adminsdk-ojqc6-e72189ce22.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// push 기능 구현
export const pushAlarm = async (deviceToken, alarmContent) => {
  const message = {
    notification: {
      title: alarmContent.title,
      body: alarmContent.body,
    },
    // data: {
    //   id: 'id',
    //   title: 'data-title',
    //   body: 'data-body',
    //   origin: 'chat',
    // },
    // android: {
    //   priority: 'high',
    //   notification: {
    //     title: title,
    //     body: body,
    //     sound: 'default',
    //     priority: 'high',
    //     icon: 'default',
    //     channelId: '500',
    //   },
    // },
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
