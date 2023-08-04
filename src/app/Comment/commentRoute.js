import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import { wrapAsync } from '../../../config/errorHandler';
import {
  getCommentList,
  getReplyList,
  postComment,
  postReply,
  putComment,
  putReply,
  deleteComment,
  deleteReply,
} from './commentController';

const commentRouter = express.Router();

commentRouter.get('/:diary_id', jwtMiddleware, wrapAsync(getCommentList)); // 댓글 보기
commentRouter.get('/reply/:comment_id', jwtMiddleware, wrapAsync(getReplyList)); // 답글 보기
commentRouter.post('/', jwtMiddleware, wrapAsync(postComment)); // 댓글 작성
commentRouter.post('/reply', jwtMiddleware, wrapAsync(postReply)); //답글 작성
//commentRouter.put('/:comment_id', jwtMiddleware, putComment) // 댓글 수정
//commentRouter.put('/reply/:reply_id', jwtMiddleware, putReply) // 답글 수정
//commentRouter.delete('/', jwtMiddleware, deleteComment) // 댓글 삭제
//commentRouter.delete('/reply', jwtMiddleware,  deleteReply) // 댓글 삭제

export default commentRouter;
