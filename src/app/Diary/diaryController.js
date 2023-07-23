import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import { retrieveDiaryList } from './diaryProvider';
import {createDiary, deleteDiaryCheck } from "./diaryService";


export const getDiaryListAll = async (req, res) => {
    const { user_id } = req.params;

    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const getDiaryListResponse = await retrieveDiaryList(user_id);
    return res.send(getDiaryListResponse);
};

export const getDiaryList = async (req, res) => {
    const { user_id } = req.params;

    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const getListResponse = await retrieveDiaryList(user_id);
    return res.send(getListResponse);
};

export const postDiary = async (req, res) => {
    // 코드 보기 쉽게 가능한 이프 작성 형식대로 따라가려함.
    // body를 "기본 정보, 내용(글과 이미지), 해시 태그, 기타 정보로 나누려고 함.
    const defaultInfo = {
        title: req.body.title,
        user_id: req.body.user_id,
        planner_id: req.body.planner_id,
        is_public : req.body.is_public,
        is_temporary : req.body.is_temporary
    };
    const contentInfo = req.body.content;

    const hashtagInfo = req.body.hashtag;

    const extraInfo = {
        is_public : req.body.is_public,
        is_temporary : req.body.is_temporary,
    }
    // 빈 아이디 체크
    if (!defaultInfo.user_id)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    // 제목 길이 체크
    if (defaultInfo.title.length > 75)
        return res.send(errResponse(baseResponse.DIARY_DIARY_TITLE_LENGTH));
    if (!defaultInfo.title) defaultInfo.title = '제목을 입력해주세요';



    const postDiaryResponse = await createDiary(defaultInfo, contentInfo, hashtagInfo, extraInfo);
    return res.send(postDiaryResponse);
};

export const deleteDiary = async (req, res) => {
    const { user_id, diary_id } = req.body;
    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!diary_id)
        return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));
    const deleteDiaryResponse = await deleteDiaryCheck(
        user_id,
        diary_id
    );
    return res.send(deleteDiaryResponse);
};