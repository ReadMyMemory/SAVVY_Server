import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
    createComment,
    createReply
} from './commentService';


export const postComment = async (req, res) => {
    const diary_id = req.params.diary_id;
    const user_id = req.verifiedToken.id;
    const contents = req.body.contents;

    // 빈 아이디 체크
    if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    //빈 다이어리 아이디 체크
    if (!diary_id) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));

    const postCommentResponse = await createComment(diary_id, user_id, contents);
    return res.send(postCommentResponse);
}

export const postReply = async (req, res) => {

        const comment_id = req.params.comment_id;
        const user_id = req.verifiedToken.id;
        const contents = req.body.contents;
        
        const postReplyResponse = await createReply(comment_id, user_id, contents);
        return res.send(postReplyResponse);
}