import pool from '../../../config/database';
import { response, errResponse } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';
import {selectCommentbyId} from "./commentDao";

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

export const commentIdCheck = async(comment_id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const commentIdCheckResult = selectCommentbyId(connection, comment_id);

    connection.release();
    return commentIdCheckResult;
}

