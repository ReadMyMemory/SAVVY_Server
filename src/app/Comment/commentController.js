import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
  createComment,
  createReply,
  modifyComment,
  modifyReply,
  deleteCommentCheck,
  deleteReplyCheck
} from './commentService';
import { retrieveCommentListAll } from "./commentProvider";
//import { retrieveCommentList, retrieveReplyList } from './commentProvider';

export const postComment = async (req, res) => {
  const diary_id = req.body.diary_id;
  const user_id = req.verifiedToken.id;
  const content = req.body.content;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  //빈 다이어리 아이디 체크
  if (!diary_id) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));

  const postCommentResponse = await createComment(diary_id, user_id, content);
  return res.send(postCommentResponse);
};

export const postReply = async (req, res) => {
  const comment_id = req.body.comment_id;
  const user_id = req.verifiedToken.id;
  const content = req.body.content;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 댓글 아이디 체크
  if (!comment_id)
    return res.send(errResponse(baseResponse.COMMENT_COMMENTID_EMPTY));

  const postReplyResponse = await createReply(comment_id, user_id, content);
  return res.send(postReplyResponse);
};

export const getCommentListAll = async(req, res) => {
  const diary_id = req.params.diary_id;
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  //빈 다이어리 아이디 체크
  if (!diary_id) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));

  const getCommentResponse = await retrieveCommentListAll(diary_id, user_id);
  return res.send(getCommentResponse);
};

/* export const getCommentList = async (req, res) => {
  const diary_id = req.params.diary_id;
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  //빈 다이어리 아이디 체크
  if (!diary_id) return res.send(errResponse(baseResponse.DIARY_DIARYID_EMPTY));

  const getCommentResponse = await retrieveCommentList(diary_id, user_id);
  return res.send(getCommentResponse);
};

export const getReplyList = async (req, res) => {
  const comment_id = req.params.comment_id;
  const user_id = req.verifiedToken.id;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 댓글 아이디 체크
  if (!comment_id) return res.send(errResponse(baseResponse.COMMENT_COMMENTID_EMPTY));

  const getReplyResponse = await retrieveReplyList(comment_id, user_id);
  return res.send(getReplyResponse);
};
*/

export const putComment = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const updateContent = req.body;
  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  console.log(updateContent.comment_id);
  // 빈 댓글 아이디 체크
  if (!updateContent.comment_id) return res.send(errResponse(baseResponse.COMMENT_COMMENTID_EMPTY));

  const putCommentResponse = await modifyComment(user_id, updateContent);
  return res.send(putCommentResponse);
};

export const putReply = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const updateContent = req.body;
  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 답글 아이디 체크
  if (!updateContent.reply_id) return res.send(errResponse(baseResponse.REPLY_REPLYID_EMPTY));

  const putReplyResponse = await modifyReply(user_id, updateContent);
  return res.send(putReplyResponse);
};

export const deleteComment = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const { comment_id } = req.params;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 댓글 아이디 체크
  if (!comment_id) return res.send(errResponse(baseResponse.COMMENT_COMMENTID_EMPTY));

  const deleteCommentResponse = await deleteCommentCheck(user_id, comment_id);
  return res.send(deleteCommentResponse);
};

export const deleteReply = async (req, res) => {
  const user_id = req.verifiedToken.id;
  const { reply_id } = req.params;

  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  // 빈 답글 아이디 체크
  if (!reply_id) return res.send(errResponse(baseResponse.REPLY_REPLYID_EMPTY));

  const deleteReplyResponse = await deleteReplyCheck(user_id, reply_id);
  return res.send(deleteReplyResponse);
};