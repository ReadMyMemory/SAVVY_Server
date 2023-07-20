import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import { retrieveDiaryList } from './diaryProvider';

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
