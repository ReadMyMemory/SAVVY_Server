export const response = ({ isSuccess, code, message }, result) => {
  return {
    isSuccess: isSuccess,
    code: code,
    message: message,
    result: result,
  };
};

export const errResponse = ({ isSuccess, code, message }) => {
  return {
    isSuccess: isSuccess,
    code: code,
    message: message,
  };
};
