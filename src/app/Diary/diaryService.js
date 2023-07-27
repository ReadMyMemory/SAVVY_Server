import baseResponse from '../../../config/baseResponseStatus';
import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import {
    userIdCheck,
    diaryIdCheck,
    diaryOwnerMatchCheck
} from "./diaryProvider";
import {
    insertDiary,
    insertContent,
    insertHashtag,
    updateDefault,
    deleteContent,
    deleteDiarybyId,
    deleteHashtag,
} from "./diaryDao";


export const deleteDiaryCheck = async (user_id, diary_id) => {
    // 다이어리 작성자 user_id와 삭제를 시도하는 user_id가 같은지 체크
    const diaryOwnermatch = await diaryOwnerMatchCheck(diary_id);
    if(user_id != diaryOwnermatch[0][0]) {
        return errResponse(baseResponse.USER_USERID_NOT_MATCH_DIARYOWNER);
    }
    const myDiaryCheck = await diaryIdCheck(diary_id);
    // diary가 존재하는지 체크
    if (!myDiaryCheck[0][0]) {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteDiarybyIdResult = await deleteDiarybyId(connection, diary_id);

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

    //type의 경우 이미지 = image, 글 = text
    //이미지에는 location 정보가 있고, 글에는 null
    for (let i = 0; i < contentInfo.length; i++) {
        await insertContent(connection, [
            diaryId[0].insertId,
            contentInfo[i].count,
            contentInfo[i].type,
            contentInfo[i].content,
            contentInfo[i].location
        ]);
    }
    //해시태그 저장
    for (let j = 0; j < hashtagInfo.length; j++) {
        await insertHashtag(connection, [
            diaryId[0].insertId,
            hashtagInfo[j].tag
        ]);
    }

    connection.release();
    return response(baseResponse.SUCCESS);
}

export const modifyDiary = async(diary_id, modifydefaultInfo, modifycontentInfo, modifyhashtagInfo) => {
    // diary가 존재하는지 체크
    const diaryExist = await diaryIdCheck(diary_id);
    if (!diaryExist[0][0]) {
        return errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST);
    }
    const connection = await pool.getConnection(async (conn) => conn);
    // 기본 정보 수정
    await updateDefault(connection, [
        modifydefaultInfo.title,
        modifydefaultInfo.planner_id,
        modifydefaultInfo.is_temporary,
        diary_id
    ]);
    // 내용 정보 수정을 위한 기존 내용 삭제
    await deleteContent(connection, diary_id);

    // 내용 정보 수정(하지만 처음 내용을 쓰는 것과 같다.)
    for (let i = 0; i < modifycontentInfo.length; i++) {
        await insertContent(connection, [
            diary_id,
            modifycontentInfo[i].count,
            modifycontentInfo[i].type,
            modifycontentInfo[i].content,
            modifycontentInfo[i].location,
        ]);
    }
    // 해시태그 정보 수정을 위한 기존 내용 삭제
    await deleteHashtag(connection, diary_id);

    // 해시태그 내용 수정(하지만 처음 내용을 쓰는 것과 같다.)
    for(let j = 0; j < modifyhashtagInfo.length; j++) {
        await insertHashtag(connection, [
            diary_id,
            modifyhashtagInfo[j].tag
        ]);
    }

    connection.release();
    return response(baseResponse.SUCCESS);
}
