import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
    retrieveDiaryList,
    retrieveDiaryTitle,
    retrieveDiaryHashtag,
    retrieveDiaryDefault,
    retrieveDiaryContent
} from './diaryProvider';
import {
    createDiary,
    modifyDiary,
    deleteDiaryCheck
} from "./diaryService";


export const getDiaryListAll = async (req, res) => {
    const user_id = req.verifiedToken.id;

    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const getDiaryListResponse = await retrieveDiaryList(user_id);
    return res.send(getDiaryListResponse);
};

export const getDiaryList = async (req, res) => {
    const user_id = req.verifiedToken.id;
    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const getListResponse = await retrieveDiaryList(user_id);
    return res.send(getListResponse);
};

export const getDiaryDetail = async (req, res) => {
    const { diary_id } = req.params;
    //빈 다이어리 아이디 체크
    if (!diary_id) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));

    const successResponse = baseResponse.SUCCESS;
    const getDiaryTitleResponse = await retrieveDiaryTitle(diary_id);
    // 다이어리가 없는 경우
    if(!getDiaryTitleResponse[0]) return res.send(errResponse(baseResponse.DAIRY_DIARYID_NOT_EXIST));
    const getDiaryHashtagResponse = await retrieveDiaryHashtag(diary_id);
    const getDiaryDefaultResponse = await retrieveDiaryDefault(diary_id);
    const getDiaryContentResponse = await retrieveDiaryContent(diary_id);

    const getDiaryDetailResponse = {successResponse, getDiaryTitleResponse, getDiaryHashtagResponse, getDiaryDefaultResponse, getDiaryContentResponse}
    return res.send(getDiaryDetailResponse);

}

export const postDiary = async (req, res) => {
    // body를 "기본 정보, 내용(글과 이미지), 해시 태그로 나누려고 함.
    const defaultInfo = {
        title: req.body.title,
        user_id: req.verifiedToken.id,
        planner_id: req.body.planner_id,
        is_public : req.body.is_public,
        is_temporary : req.body.is_temporary
    };
    const contentInfo = req.body.content;

    const hashtagInfo = req.body.hashtag;

    console.log(req.verifiedToken);
    // 빈 아이디 체크
    if (!defaultInfo.user_id)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    // 제목 길이 체크
    if (defaultInfo.title.length > 75)
        return res.send(errResponse(baseResponse.DIARY_DIARY_TITLE_LENGTH));
    if (!defaultInfo.title) defaultInfo.title = '제목을 입력해주세요';



    const postDiaryResponse = await createDiary(defaultInfo, contentInfo, hashtagInfo);
    return res.send(postDiaryResponse);
};

export const putDiary = async (req, res) => {
    //postDiary와 비슷하지만 이미 만들어진 diary_id를 파라미터로 받아 처리한다는 거
    //그리고 내용(글과 이미지), 해시태그는 postDiary랑 같게 바디로 담아온다.
    //그러니까 수정을 한다 해도 기존 내용 다 삭제하고 다시 새로 쓰는 것처럼 한다.
    const diary_id = req.body.diary_id;
    const modifydefaultInfo = {
        title: req.body.title,
        planner_id : req.body.planner_id,
        is_temporary : req.body.is_temporary
    };
    const modifycontentInfo = req.body.content;

    const modifyhashtagInfo = req.body.hashtag;

    // 제목 길이 체크
    if (modifydefaultInfo.title.length > 75)
        return res.send(errResponse(baseResponse.DIARY_DIARY_TITLE_LENGTH));
    if (!modifydefaultInfo.title) modifydefaultInfo.title = '제목을 입력해주세요';


    const putDiaryResponse = await modifyDiary(diary_id, modifydefaultInfo, modifycontentInfo, modifyhashtagInfo);
    return res.send(putDiaryResponse);
}


export const deleteDiary = async (req, res) => {
    const user_id = req.verifiedToken.id;
    const { diary_id } = req.params;
    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!diary_id) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));
    const deleteDiaryResponse = await deleteDiaryCheck(
        user_id,
        diary_id
    );
    return res.send(deleteDiaryResponse);
};