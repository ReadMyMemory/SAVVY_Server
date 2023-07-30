import express from 'express';
import { jwtMiddleware } from '../../../config/jwtMiddleware';
import {
    getCommentList,
    getReplyList,
    postComment,
    postReply,
    putComment,
    putReply,
    deleteComment,
    deleteReply
} from './commentController';


const commentRouter = express.Router();


//commentRouter.get('/', jwtMiddleware, getCommentList) // 댓글 보기
//commentRouter.get('/reply', jwtMiddleware, getReplyList) // 답글 보기
commentRouter.post('/:diary_id', jwtMiddleware, postComment) // 댓글 작성
commentRouter.post('/reply/:comment_id', jwtMiddleware, postReply) //답글 작성
//commentRouter.put('/:comment_id', jwtMiddleware, putComment) // 댓글 수정
//commentRouter.put('/reply/:reply_id', jwtMiddleware, putReply) // 답글 수정
//commentRouter.delete('/', jwtMiddleware, deleteComment) // 댓글 삭제
//commentRouter.delete('/reply/', jwtMiddleware,  deleteReply) // 댓글 삭제

export default commentRouter;