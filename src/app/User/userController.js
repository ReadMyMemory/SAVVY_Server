import { errResponse, response } from '../../../config/response';
import baseResponse from '../../../config/baseResponseStatus';

// 0. 테스트 API
export const getTest = async (req, res) => {
  return res.send(response(baseResponse.SUCCESS));
};
