const baseResponse = {
  // Success
  SUCCESS: { isSuccess: true, code: 1000, message: '성공' },

  // Common
  TOKEN_EMPTY: {
    isSuccess: false,
    code: 2000,
    message: 'JWT 토큰을 입력해주세요.',
  },
  TOKEN_VERIFICATION_FAILURE: {
    isSuccess: false,
    code: 3000,
    message: 'JWT 토큰 검증 실패',
  },
  TOKEN_VERIFICATION_SUCCESS: {
    isSuccess: true,
    code: 1001,
    message: 'JWT 토큰 검증 성공',
  }, // ?
  TOKEN_KAKAO_EMPTY: {
    isSuccess: false,
    code: 2200,
    message: 'KAKAO 토큰을 입력해주세요.',
  },
  TOKEN_GENERATE_ERROR: {
    isSuccess: false,
    code: 4003,
    message: 'JWT 토큰 생성 실패',
  },

  //Request error
  SIGNUP_EMAIL_EMPTY: {
    isSuccess: false,
    code: 2001,
    message: '이메일을 입력해주세요',
  },
  SIGNUP_EMAIL_LENGTH: {
    isSuccess: false,
    code: 2002,
    message: '이메일은 30자리 미만으로 입력해주세요.',
  },
  SIGNUP_EMAIL_ERROR_TYPE: {
    isSuccess: false,
    code: 2003,
    message: '이메일을 형식을 정확하게 입력해주세요.',
  },
  SIGNUP_PASSWORD_EMPTY: {
    isSuccess: false,
    code: 2004,
    message: '비밀번호를 입력 해주세요.',
  },
  SIGNUP_PASSWORD_LENGTH: {
    isSuccess: false,
    code: 2005,
    message: '비밀번호는 6~20자리를 입력해주세요.',
  },
  SIGNUP_NICKNAME_EMPTY: {
    isSuccess: false,
    code: 2006,
    message: '닉네임을 입력 해주세요.',
  },
  SIGNUP_NICKNAME_LENGTH: {
    isSuccess: false,
    code: 2007,
    message: '닉네임은 최대 20자리를 입력해주세요.',
  },

  SIGNUP_INTRO_LENGTH: {
    isSuccess: false,
    code: 2008,
    message: '소개글은 100자 이하로 입력해주세요.',
  },
  SIGNIN_EMAIL_LENGTH: {
    isSuccess: false,
    code: 2009,
    message: '이메일은 30자리 미만으로 입력해주세요.',
  },
  SIGNIN_EMAIL_ERROR_TYPE: {
    isSuccess: false,
    code: 2010,
    message: '이메일을 형식을 정확하게 입력해주세요.',
  },
  SIGNIN_PASSWORD_EMPTY: {
    isSuccess: false,
    code: 2011,
    message: '비밀번호를 입력 해주세요.',
  },

  USER_USERID_EMPTY: {
    isSuccess: false,
    code: 2012,
    message: 'userId를 입력해주세요.',
  },
  USER_USERID_NOT_EXIST: {
    isSuccess: false,
    code: 2013,
    message: '해당 회원이 존재하지 않습니다.',
  },

  USER_USEREMAIL_EMPTY: {
    isSuccess: false,
    code: 2014,
    message: '이메일을 입력해주세요.',
  },
  USER_USEREMAIL_NOT_EXIST: {
    isSuccess: false,
    code: 2015,
    message: '해당 이메일을 가진 회원이 존재하지 않습니다.',
  },
  USER_ID_NOT_MATCH: {
    isSuccess: false,
    code: 2016,
    message: '유저 아이디 값을 확인해주세요',
  },
  USER_NICKNAME_EMPTY: {
    isSuccess: false,
    code: 2017,
    message: '변경할 닉네임 값을 입력해주세요',
  },

  USER_STATUS_EMPTY: {
    isSuccess: false,
    code: 2018,
    message: '회원 상태값을 입력해주세요',
  },

  PLANNER_PLANNERID_EMPTY: {
    isSuccess: false,
    code: 2019,
    message: 'plannerId를 입력해주세요.',
  },

  PLANNER_TYPE_WRONG: {
    isSuccess: false,
    code: 2020,
    message: 'type값이 올바르지 않습니다.',
  },

  PLANNER_PLANNER_TITLE_LENGTH: {
    isSuccess: false,
    code: 2021,
    message: '제목은 15자리 미만으로 입력해주세요.',
  },

  PLANNER_PLANNER_TIMETABLE_EMPTY: {
    isSuccess: false,
    code: 2022,
    message: '시간표를 입력해주세요.',
  },

  PLANNER_PLANNER_SEARCHWORD_EMPTY: {
    isSuccess: false,
    code: 2023,
    message: '검색어를 입력해주세요.',
  },

  PLANNER_PLANNER_SEARCHWORD_LENGTH: {
    isSuccess: false,
    code: 2024,
    message: '검색어는 15자리 미만으로 입력해주세요.',
  },

  DIARY_DIARY_TITLE_LENGTH: {
    isSuccess: false,
    code: 2101,
    message: '제목은 25자리 미만으로 입력해주세요.',
  },
  DIARY_DIARYID_EMPTY: {
    isSuccess: false,
    code: 2102,
    message: 'diaryId를 입력해주세요.',
  },
  USER_USERID_NOT_MATCH_DIARYOWNER: {
    isSuccess: false,
    code: 2103,
    message: '다이어리 작성자가 아닙니다.',
  },
  DAIRY_DIARYID_NOT_EXIST: {
    isSuccess: false,
    code: 2104,
    message: '해당 다이어리가 존재하지 않습니다.',
  },
  REPORT_REASON_IS_INVALID: {
    isSuccess: false,
    code: 2300,
    message: 'reason값이 유효하지 않습니다.',
  },
  REPORT_REASON_NOT_CHECKED: {
    isSuccess: false,
    code: 2301,
    message: '하나 이상의 신고 사유를 체크해주세요.',
  },
  REPORT_CONTENTS_CANT_BE_WRITTEN: {
    isSuccess: false,
    code: 2302,
    message: '신고사유 중 기타를 체크하지 않았습니다.',
  },
  REPORT_BLOCK_INVALID: {
    isSuccess: false,
    code: 2303,
    message: 'is_blocked값이 유효하지 않습니다.',
  },
  COMMENT_COMMENTID_EMPTY: {
    isSuccess: false,
    code: 2401,
    message: 'commentId를 입력해주세요.',
  },
  COMMENT_COMMENTID_NOT_EXIST: {
    isSuccess: false,
    code: 2402,
    message: '해당 댓글이 존재하지 않습니다',
  },
  COMMENT_IS_UPDATED_DATETYPE_EXCEPTION: {
    isSuccess: false,
    code: 2403,
    message: '댓글의 수정 여부 데이터가 true/false 형태가 아닙니다.',
  },
  REPLY_IS_UPDATED_DATETYPE_EXCEPTION: {
    isSuccess: false,
    code: 2404,
    message: '답글의 수정 여부 데이터가 true/false 형태가 아닙니다.',
  },
  DAIRY_DIARY_LIKE_COUNT_IS_INVALID: {
    isSuccess: false,
    code: 2405,
    message: '현재 다이어리의 좋아요 개수가 0보다 적습니다.'
  },
  DAIRY_STATUS_VALUE_IS_INVALID: {
    isSuccess: false,
    code: 2406,
    message: '상태를 변경하고자 하는 VALUE값이 올바르지 않습니다.'
  },
  DIARY_DIARY_METHOD_TYPE_EMPTY: {
    isSuccess: false,
    code: 2407,
    message: '쿼리 스트링에 담긴 TYPE이 올바르지 않거나 비어있습니다.'
  },
  DAIRY_DIARY_METHOD_VALUE_EMPTY: {
    isSuccess: false,
    code: 2408,
    message: '쿼리 스트링에 담긴 VALUE가 올바르지 않거나 비어있습니다.'
  },
  DAIRY_USER_ALREADY_DIARY_LIKED: {
    isSuccess: false,
    code: 2409,
    message: '이미 좋아요를 누른 다이어리에 좋아요를 추가하려고 시도하고 있습니다.'
  },
  DAIRY_USER_NOT_DIARY_LIKED: {
    isSuccess: false,
    code: 2410,
    message: '좋아요를 누르지 않은 다이어리에 좋아요를 취소하려고 시도하고 있습니다.'
  },
  DAIRY_DAIRY_PUBLIC_STATUS_ALREADY_TRUE: {
    isSuccess: false,
    code: 2411,
    message: '다이어리 상태를 공개로 바꾸려고 하지만, 이미 공개 상태입니다.'
  },
  DAIRY_DAIRY_PUBLIC_STATUS_ALREADY_FALSE: {
    isSuccess: false,
    code: 2412,
    message: '다이어리 상태를 비공개로 바꾸려고 하지만, 이미 비공개 상태입니다.'
  },
  DIARY_DAIRY_ID_INVALID: {
    isSuccess: false,
    code: 2413,
    message: 'diary_id의 값이 숫자가 아닙니다.'
  },
  DAIRY_NOT_EXIST_SHOWN_DIARY: {
    isSuccess: false,
    code: 2414,
    message: '더 이상 보여줄 다이어리가 없습니다.'
  },
  REPLY_REPLYID_EMPTY: {
    isSuccess: false,
    code: 2415,
    message: 'replyId를 입력해주세요.'
  },
  REPLY_REPLYID_NOT_EXIST: {
    isSuccess: false,
    code: 2416,
    message: '해당 답글이 존재하지 않습니다.'
  },
  USER_USERID_NOT_MATCH_COMMENTOWNER: {
    isSuccess: false,
    code: 2417,
    message: '댓글 작성자가 아닙니다.'
  },
  USER_USERID_NOT_MATCH_REPLYOWNER: {
    isSuccess: false,
    code: 2418,
    message: '답글 작성자가 아닙니다.'
  },

  // Response error
  SIGNUP_REDUNDANT_EMAIL: {
    isSuccess: false,
    code: 3001,
    message: '중복된 이메일입니다.',
  },
  SIGNUP_REDUNDANT_NICKNAME: {
    isSuccess: false,
    code: 3002,
    message: '중복된 닉네임입니다.',
  },

  SIGNIN_EMAIL_WRONG: {
    isSuccess: false,
    code: 3003,
    message: '아이디가 잘못 되었습니다.',
  },
  SIGNIN_PASSWORD_WRONG: {
    isSuccess: false,
    code: 3004,
    message: '비밀번호가 잘못 되었습니다.',
  },
  SIGNIN_INACTIVE_ACCOUNT: {
    isSuccess: false,
    code: 3005,
    message: '비활성화 된 계정입니다. 고객센터에 문의해주세요.',
  },
  SIGNIN_WITHDRAWAL_ACCOUNT: {
    isSuccess: false,
    code: 3006,
    message: '탈퇴 된 계정입니다. 고객센터에 문의해주세요.',
  },
  PLANNER_PLANNERID_NOT_EXIST: {
    isSuccess: false,
    code: 3007,
    message: '해당 여행계획서가 존재하지 않습니다.',
  },
  PLANNER_SCRAP_NOT_EXIST: {
    isSuccess: false,
    code: 3008,
    message: '해당 스크랩이 존재하지 않습니다.',
  },
  PLANNER_TIMETABLEID_NOT_EXIST: {
    isSuccess: false,
    code: 3009,
    message: '해당 시간표가 존재하지 않습니다.',
  },
  PLANNER_SCRAP_ALREADY_EXIST: {
    isSuccess: false,
    code: 3010,
    message: '해당 스크랩이 이미 존재합니다.',
  },
  PLANNER_PLANNER_IS_NOT_UPLOADED: {
    isSuccess: false,
    code: 3011,
    message: '업로드 되지 않은 여행계획서입니다.',
  },
  PLANNER_SCRAP_OWNER_IS_SAME: {
    isSuccess: false,
    code: 3012,
    message: '본인의 여행계획서는 스크랩 할 수 없습니다.',
  },
  SEARCHING_HISTORY_INSERT_ERROR: {
    isSuccess: false,
    code: 3013,
    message: '검색기록 생성 실패',
  },
  SEARCHING_HISTORY_NOT_EXIST: {
    isSuccess: false,
    code: 3014,
    message: '검색기록이 존재하지 않습니다.',
  },
  USER_NEED_SIGNUP: {
    isSuccess: false,
    code: 3200,
    message: '회원가입이 필요한 사용자입니다.',
  },
  USER_USERID_ALREADY_EXIST: {
    isSuccess: false,
    code: 3201,
    message: '이미 존재하는 사용자입니다.',
  },
  REPORT_ALREADY_EXIST: {
    isSuccess: false,
    code: 3300,
    message: '이미 신고한 여행계획서입니다.',
  },

  //Connection, Transaction 등의 서버 오류
  DB_ERROR: { isSuccess: false, code: 4000, message: '데이터 베이스 에러' },
  SERVER_ERROR: { isSuccess: false, code: 4001, message: '서버 에러' },
  AXIOS_ERROR: { isSuccess: false, code: 4002, message: 'AXIOS 에러' },
  S3_ERROR: { isSuccess: false, code: 4003, message: '이미지 url 생성 실패' },
  TIME_ERROR: {
    isSuccess: false,
    code: 4004,
    message: 'updated_at이 0이거나 음수의 값을 가집니다.',
  },
  ALARM_ERROR: {
    isSuccess: false,
    code: 4005,
    message: '알림 메세지 전송 에러',
  },
};

export default baseResponse;
