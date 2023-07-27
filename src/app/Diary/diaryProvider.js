import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import { selectUserbyId } from '../User/userDao';
import {
    selectDiaryListById,
    selectDiaryId,
    selectDiarybyId,
    selectUserbyDiaryId,
    selectDiaryDefault,
    selectDiaryContent,
    selectDiaryHashtag,
    selectDiaryTitle
} from "./diaryDao";

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);


export const userIdCheck = async (user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdCheckResult = selectUserbyId(connection, user_id);

    connection.release();
    return userIdCheckResult;
};
export const diaryIdCheck = async (diary_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const diaryIdCheckResult = selectDiarybyId(connection, diary_id);

    connection.release();
    return diaryIdCheckResult;
};

export const diaryOwnerMatchCheck = async (diary_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const diaryOwnerMatchCheckResult = selectUserbyDiaryId(connection, diary_id);

    connection.release();
    return diaryOwnerMatchCheckResult;
}

export const retrieveDiaryList = async (user_id) => {
    // user_id 존재 체크
    const diaryOwner = await userIdCheck(user_id);
    if (!diaryOwner[0][0]) {
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);
    }

    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveDairyListResult = await selectDiaryListById(connection, user_id);
    //일단은 임시 방법. dayjs를 사용
    // 시간을 한국 시간대로 변경해 YYYY-MM-DD HH:mm:ss 형식으로 변환하는 과정. 다른 방식으로도 변환 가능.
    for(let i = 0; i < retrieveDairyListResult[0].length; i++) {
        const updatedTimeUTC = dayjs(retrieveDairyListResult[0][i].updated_at).utc();
        const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
        retrieveDairyListResult[0][i].updated_at = updatedTimeKorea.format('YYYY-MM-DD HH:mm:ss');
    }
    connection.release();
    if (retrieveDairyListResult[0][0]) {
        return response(baseResponse.SUCCESS, retrieveDairyListResult[0]);
    } else {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
};

// 다이어리 제목 정보(제목)
export const retrieveDiaryTitle = async (diary_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveDiaryTitleResult = await selectDiaryTitle(connection, diary_id);

    connection.release();
    return retrieveDiaryTitleResult[0];
}

// 다이어리 태그 정보(해시태그)
export const retrieveDiaryHashtag = async (diary_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveDiaryHashtagResult = await selectDiaryHashtag(connection, diary_id);

    connection.release();
    return retrieveDiaryHashtagResult[0];
}

// 다이어리 기본 정보(작성자, 작성 날짜 등)
export const retrieveDiaryDefault = async (diary_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveDiaryDefaultResult = await selectDiaryDefault(connection, diary_id);
    // 시간대를 한국 시간대로 바꾸는 과정
    const updatedTimeUTC = dayjs(retrieveDiaryDefaultResult[0][0].updated_at).utc();
    const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
    retrieveDiaryDefaultResult[0][0].updated_at = updatedTimeKorea.format('YYYY-MM-DD HH:mm:ss');

    connection.release();
    return retrieveDiaryDefaultResult[0];
}

// 다이어리 내용 정보(글, 사진 등)
export const retrieveDiaryContent = async (diary_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveDiaryContentResult = await selectDiaryContent(connection, diary_id);

    connection.release();
    return retrieveDiaryContentResult[0];
}

export const retrieveDiaryId = async (user_id) => {
    // 방금 만든 Diary의 id를 받아오기 위함
    const diaryOwner = await userIdCheck(user_id);
    if (!diaryOwner[0][0]) {
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);
    }

    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveDiaryIdResult = await selectDiaryId(connection, user_id);

    connection.release();
    return retrieveDiaryIdResult;
};

