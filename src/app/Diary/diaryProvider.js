import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import { selectUserbyId } from '../User/userDao';
import { selectDiaryListById } from "./diaryDao";

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


export const retrieveDiaryList = async (user_id) => {
    // user_id 존재 체크
    const diaryOwner = await userIdCheck(user_id);
    if (!diaryOwner[0][0]) {
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);
    }

    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveDairyListResult = await selectDiaryListById(connection, user_id);

    connection.release();
    if (retrieveDairyListResult[0][0]) {
        return response(baseResponse.SUCCESS, retrieveDairyListResult[0]);
    } else {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
};

export const retrieveDiaryId = async (user_id) => {
    // 방금 만든 Diary의 id를 받아오기 위함
    const diaryOwner = await userIdCheck(user_id);
    if (!diaryOwner[0][0]) {
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);
    }

    const connection = await pool.getConnection(async (conn) => conn);
    const retrievePlannerIdResult = await selectPlannerId(connection, user_id);

    connection.release();
    return retrievePlannerIdResult;
};

