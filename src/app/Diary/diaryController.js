import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
    retrieveDiaryList,
    retrieveDiaryDetail
} from './diaryProvider';
import {
    createDiary,
    modifyDiary,
    deleteDiaryCheck,
    updateLikeCount,
    updatedPublicStatus
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
    const user_id = req.verifiedToken.id;
    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const { diary_id } = req.params;
    //빈 다이어리 아이디 체크
    if (!diary_id) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));

    const getDiaryDetailResponse = await retrieveDiaryDetail(user_id, diary_id);
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
    // 빈 아이디 체크
    if (!defaultInfo.user_id)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    // 제목 길이 체크
    if (defaultInfo.title.length > 75)
        return res.send(errResponse(baseResponse.DIARY_DIARY_TITLE_LENGTH));
    if (!defaultInfo.title) defaultInfo.title = '제목을 입력해주세요';

    //공개 여부, 임시 저장 여부 데이터 치환
    if(defaultInfo.is_public === true) defaultInfo.is_public = 'true';
    else defaultInfo.is_public = 'false';
    if(defaultInfo.is_temporary === true) defaultInfo.is_temporary = 'true';
    else defaultInfo.is_temporary = 'false';


    const postDiaryResponse = await createDiary(defaultInfo, contentInfo, hashtagInfo);
    return res.send(postDiaryResponse);
};

export const putDiary = async (req, res) => {
    //postDiary와 비슷하지만 이미 만들어진 diary_id를 파라미터로 받아 처리한다는 거
    //그리고 내용(글과 이미지), 해시태그는 postDiary랑 같게 바디로 담아온다.
    //그러니까 수정을 한다 해도 기존 내용 다 삭제하고 다시 새로 쓰는 것처럼 한다.
    const diary_id = req.body.diary_id;
    const modifydefaultInfo = {
        title: req.body.title
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

export const postDiaryImage = async(req, res) => {
    if (!req.files) return res.send(errResponse(baseResponse.S3_ERROR));
    const fileResponse = new Array();
    for(let i = 0; i < req.files.length; i++) {
        fileResponse.push({pic_url : req.files[i].location});
    }
    if (!fileResponse) return res.send(errResponse(baseResponse.S3_ERROR));
    return res.send(response(baseResponse.SUCCESS, fileResponse));
}

export const ModifyStatus = async(req, res) => {
    const user_id = req.verifiedToken.id;
    const { diary_id, type, value } = req.query;

    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    // 빈 다이어리 아이디 체크
    if (!diary_id) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));
    //value(up, down, true, false) 체크
    if(value !== 'up' && value !== 'down' && value !== 'true' && value !== 'false') {
        return res.send(errResponse(baseResponse.DAIRY_DIARY_METHOD_VALUE_EMPTY));
    }
    //type(like, public) 체크
    if (type !== 'like' && type !== 'public') {
        return res.send(errResponse(baseResponse.DIARY_DIARY_METHOD_TYPE_EMPTY));
    }
    if(type === 'like') {
        const modifyLikeCountResponse = await updateLikeCount(user_id, diary_id, value);
        return res.send(modifyLikeCountResponse);
    } else {
        const modifyPublicStatusResponse = await updatedPublicStatus(user_id, diary_id, value);
        return res.send(modifyPublicStatusResponse);
    }






}

