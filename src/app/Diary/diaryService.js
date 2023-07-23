import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import {
    userIdCheck,
    diaryIdCheck,
} from "./diaryProvider";
import {
    insertDiary,
    insertContent,
    insertHashtag,
    insertExtra
} from "./diaryDao";
import {insertPlanner, insertTimetable} from "../Planner/plannerDao";


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
        defaultInfo.user_id,
        defaultInfo.planner_id,
        defaultInfo.is_public,
        defaultInfo.is_temporary
    ]);
    // diary 생성중 에러 검증
    if (!diaryId[0].insertId) {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
    //내용 저장(이미지, 글, 장소).
    //이들은 모두 type 으로 구분한다.

    //이미지 = image, 글 = text, 장소 = location
    for (let i = 0; i < contentInfo.length; i++) {
        const contentId = await insertContent(connection, [
            diaryId[0].insertId,
            contentInfo[i].count,
            contentInfo[i].type,
            contentInfo[i].content,
            contentInfo[i].location
        ]);
    }
    //해시태그 저장
    for (let j = 0; j < hashtagInfo.length; j++) {
        const hashtagId = await insertHashtag(connection, [
            diaryId[0].insertId,
            hashtagInfo[j].tag
        ]);
    }

    connection.release();
    return response(baseResponse.SUCCESS);
}
