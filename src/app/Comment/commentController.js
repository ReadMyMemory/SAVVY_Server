import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';


export const postComment = async (req, res) => {
    const commentInfo = {
        user_id: req.verifiedToken.id,
        content: req.body.content


    }

}
export const postReply = async (req, res) => {
    const replyInfo = {

    }
}