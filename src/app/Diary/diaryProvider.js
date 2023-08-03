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
    selectIsLiked
} from "./diaryDao";

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);


export const userIdCheck = async (user_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdCheckResult = await selectUserbyId(connection, user_id);

    connection.release();
    return userIdCheckResult;
};
export const diaryIdCheck = async (diary_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const diaryIdCheckResult = await selectDiarybyId(connection, diary_id);

    connection.release();
    return diaryIdCheckResult;
};

export const diaryOwnerMatchCheck = async (diary_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const diaryOwnerMatchCheckResult = await selectUserbyDiaryId(connection, diary_id);
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
    //시간을 한국 시간대로 변경해 YYYY-MM-DD HH:mm:ss 형식으로 변환하는 과정. 다른 방식으로도 변환 가능.
    for(let i = 0; i < retrieveDairyListResult[0].length; i++) {
        const updatedTimeUTC = dayjs(retrieveDairyListResult[0][i].updated_at).utc();
        const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
        retrieveDairyListResult[0][i].updated_at = updatedTimeKorea.format('YYYY.MM.DD');
    }
    connection.release();
    if (retrieveDairyListResult[0][0]) {
        return response(baseResponse.SUCCESS, retrieveDairyListResult[0]);
    } else {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
};

export const retrieveDiaryDetail = async(user_id, diary_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const defaultInfo = await selectDiaryDefault(connection, diary_id);
    // dairy가 없을 경우
    if (!defaultInfo[0][0])
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    // 시간 포맷 변경(YYYY.MM.DD)
    const updatedTimeUTC = dayjs(defaultInfo[0][0].updated_at).utc();
    const updatedTimeKorea = updatedTimeUTC.tz('Asia/Seoul');
    defaultInfo[0][0].updated_at = updatedTimeKorea.format('YYYY.MM.DD');
    const isLikedInfo = await selectIsLiked(connection, [
        user_id,
        diary_id
    ]);
    // 다이어리를 보는 유저가 이 다이어리에 좋아요 눌렀는지 검증하는 과정
    if (!isLikedInfo[0][0]) {
        defaultInfo[0][0].isLiked = false;
    }
    else {
        defaultInfo[0][0].isLiked = true;
    }
    const retrieveDiaryContentResult = await selectDiaryContent(connection, diary_id);
    const retrieveDiaryHashtagResult = await selectDiaryHashtag(connection, diary_id);
    defaultInfo[0][0].content = retrieveDiaryContentResult[0];
    defaultInfo[0][0].hashtag = retrieveDiaryHashtagResult[0];

    connection.release();
    // Response
    return response(baseResponse.SUCCESS, defaultInfo[0][0]);
};

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

