import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
    retrieveDiaryList,
    retrieveDiaryDetail,
    retrieveHomeListdefault,
    retrieveHomeListbyId,
    retrieveDiarySearch
} from './diaryProvider';
import {
    createDiary,
    modifyDiary,
    deleteDiaryCheck,
    updateLikeCount,
    updatedPublicStatus,
    createDiaryReport
} from "./diaryService";
import {create} from "axios";


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
};

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
};

export const getHomeList = async(req, res) => {
    const user_id = req.verifiedToken.id;
    const { diary_id } = req.query;
    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    //처음 홈에서 글을 불러오는 경우, 쿼리가 비어있어야 한다.
    if (!diary_id) {
        const getHomeListResponse = await retrieveHomeListdefault(user_id);
        return res.send(getHomeListResponse);
    } else {    // 다이어리 아이디가 비어있지 않지만, 숫자가 아닌 경우
        if (isNaN(diary_id) === true) return res.send(errResponse(baseResponse.DIARY_DAIRY_ID_INVALID));
        // diary_id에 정상적으로 마지막 조회한 글의 id가 담긴다.
        const getHomeListResponse = await retrieveHomeListbyId(user_id, diary_id);
        return res.send(getHomeListResponse);
    }
};

export const postDiaryReport = async (req, res) => {
    const reason = [
        req.body.reason_1,
        req.body.reason_2,
        req.body.reason_3,
        req.body.reason_4,
    ];
    const defaultInfo = {
        diary_id: req.body.diary_id,
        contents: req.body.contents,
        is_blocked: req.body.is_blocked,
    };
    const user_id = req.verifiedToken.id;

    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    // 빈 다이어리 아이디 체크
    if (!defaultInfo.diary_id) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));
    // reason 유무 체크
    let cnt = 0;
    for (let i = 0; i < 4; i++) {
        if (reason[i] !== 0 && reason[i] !== 1) {
            return res.send(errResponse(baseResponse.REPORT_REASON_IS_INVALID));
        }
        if (reason[i] === 0) cnt++;
    }
    // reason이 모두 0일 때
    if (cnt === 4)
        return res.send(errResponse(baseResponse.REPORT_REASON_NOT_CHECKED));
    // content만 입력되었을 때
    if (reason[3] === 0 && defaultInfo.contents)
        return res.send(errResponse(baseResponse.REPORT_CONTENTS_CANT_BE_WRITTEN));
    // is_blocked 체크
    if (defaultInfo.is_blocked !== 0 && defaultInfo.is_blocked !== 1)
        return res.send(errResponse(baseResponse.REPORT_BLOCK_INVALID));

    const createDiaryReportResult = await createDiaryReport(
        user_id,
        defaultInfo,
        reason
    );
    return res.send(createDiaryReportResult);
};

export const getDiarySearch = async(req, res) => {
    const user_id = req.verifiedToken.id;
    const {searchWord} = req.query;
    // 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    // 빈 검색어 체크
    if (!searchWord) return res.send(errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_EMPTY));
    // 검색어 길이 체크
    if (searchWord.length > 45) return res.send(errResponse(baseResponse.PLANNER_PLANNER_SEARCHWORD_LENGTH));
    const getDiarySearchResponse = await retrieveDiarySearch(
        user_id,
        searchWord
    );
    return res.send(getDiarySearchResponse);

}

