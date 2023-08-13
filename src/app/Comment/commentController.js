import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {
  createComment,
  createReply,
  modifyComment,
  modifyReply,
  deleteCommentCheck,
  deleteReplyCheck,
  createCommentReport,
  createReplyReport
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

export const postCommentReport = async (req, res) => {
  const reason = [
    req.body.reason_1,
    req.body.reason_2,
    req.body.reason_3,
    req.body.reason_4,
  ];
  const user_id = req.verifiedToken.id;
  // 빈 아이디 체크
  if (!user_id) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
  const { type } = req.query;
  //쿼리스트링 type 조건 체크
  if(type !== 'comment' && type !== 'reply') {
    return res.send(errResponse(baseResponse.REPORT_COMMENT_METHOD_TYPE_EMPTY));
  }
  if(type === 'comment') {
    const defaultInfo = {
      comment_id: req.body.comment_id,
      contents: req.body.contents,
      is_blocked: req.body.is_blocked
    };

    // 빈 댓글 아이디 체크
    if (!defaultInfo.comment_id) return res.send(errResponse(baseResponse.COMMENT_COMMENTID_EMPTY));

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
    const createCommentReportResult = await createCommentReport(
        user_id,
        defaultInfo,
        reason
    );
    return res.send(createCommentReportResult);
  } else if(type === 'reply') {
    const defaultInfo = {
      reply_id: req.body.reply_id,
      contents: req.body.contents,
      is_blocked: req.body.is_blocked
      };
      // 빈 답글 아이디 체크
      if (!defaultInfo.reply_id) return res.send(errResponse(baseResponse.REPLY_REPLYID_EMPTY));

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

    const createReplyReportResult = await createReplyReport(
        user_id,
        defaultInfo,
        reason
    );
    return res.send(createReplyReportResult);
  } else {
    return res.send(errResponse(baseResponse.REPORT_COMMENT_OTHER_EXCEPTION));
  }

};