import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {createComment, createReply } from './commentService';


export const postComment = async (req, res) => {

        const diary_id = req.params.diary_id;
        const user_id = req.verifiedToken.id;
        const contents = req.body.contents;
        


    const postCommentResponse = await createComment(diary_id, user_id, contents);
    return postCommentResponse;
}



export const postReply = async (req, res) => {

        const comment_id = req.params.comment_id;
        const user_id = req.verifiedToken.id;
        const contents = req.body.contents;
        
        const postReplyResponse = await createReply(comment_id, user_id, contents);
        return postReplyResponse;
}