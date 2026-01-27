export const HR_ERROR_CODES = {
  DUPLICATE_RESIDENT_NO: {
    code: 'HR_409_01',
    message: '이미 등록된 주민번호입니다.',
  },
  INVALID_DEPARTMENT: {
    code: 'HR_404_01',
    message: '존재하지 않는 부서입니다.',
  },
} as const;
