import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import {
    userIdCheck,
    diaryIdCheck,


} from "./diaryProvider";


export const deleteDiaryCheck = async (user_id, diary_id) => {
    const diaryOwner = await userIdCheck(user_id);
    if (!diaryOwner[0][0]) {
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);
    }
    const myDiaryCheck = await diaryIdCheck(diary_id);
    // diary가 존재하는지 체크
    if (!myDiaryCheck[0][0]) {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteDiarybyIdResult = deleteDiarybyId(connection, diary_id);

    connection.release();
    return response(baseResponse.SUCCESS, deleteDiarybyIdResult[0]);
};

export const createDiary = async (defaultInfo, contentInfo, hashtagInfo) => {
    // user가 존재하는지 체크
    const userExist = await userIdCheck(defaultInfo.user_id);
    if (!userExist[0][0]) {
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    const diaryId = await insertDiary(connection, [
        defaultInfo.title,
        defaultInfo.user_id
    ]);
    // diary 생성중 에러 검증
    if (!diaryId[0].insertId) {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
    //내용 저장(이미지, 글)
    //이미지 개수는 글 개수보다 1개 작아야함.
    //글 개수 받아와서 반복문 돌려야 함.
    const contentId = await insertContent(connection, [

    ])



    //해시태그 저장
}
