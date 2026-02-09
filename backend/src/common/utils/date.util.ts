import dayjs from 'dayjs';

export const getKstDate = () => new Date().toLocaleDateString('en-CA');
export const DB_MAX_DATE = '9999-12-31';

export const calculateTotalCareerMonths = (experiences: { entranceDate: Date; resignationDate?: Date | null }[]): number => {
  try {
    if (!experiences || experiences.length === 0) return 0;

    return experiences.reduce((acc: number, exp) => {
      const start = dayjs(exp.entranceDate);
      const end = exp.resignationDate ? dayjs(exp.resignationDate) : dayjs();
      const diffMonths: number = end.diff(start, 'month');
      return acc + (diffMonths > 0 ? diffMonths : 0);
    }, 0);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Career calculation error:', errorMessage);

    return 0; // 이 함수는 number를 반환해야 하므로 0을 반환
  }
};

// DB의 Date 객체를 프론트엔드용 문자열로 변환 (보낼 때)
export const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY.MM.DD');
};

// 프론트엔드의 문자열을 DB용 Date 객체로 변환 (받을 때)
export const parseDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr || dateStr.trim() === '') return null;
  const parsed = dayjs(dateStr);
  return parsed.isValid() ? parsed.toDate() : null;
};

/** 특정 날짜에서 n일을 뺀 Date 객체를 반환 */
export const subtractDays = (date: Date | string, days: number = 1): Date => {
  return dayjs(date).subtract(days, 'day').toDate();
};

/** 특정 날짜에서 n일을 더한 Date 객체를 반환 */
export const addDays = (date: Date | string, days: number = 1): Date => {
  return dayjs(date).add(days, 'day').toDate();
};

/**
 * DB(UTC) 저장 시 타임존 차이로 인해 날짜가 하루 전으로 밀리는 현상을 방지합니다.
 * 시간을 낮 12시로 고정하여 UTC 변환 후에도 날짜가 유지되도록 합니다.
 */
export const toSafeDate = (date: Date | string): Date => {
  return dayjs(date).hour(12).minute(0).second(0).toDate();
};

// 기존에 만든 연산 함수들도 이 safe 로직을 타게 하면 더 좋습니다.
export const subtractDaysSafe = (date: Date | string, days: number = 1): Date => {
  return dayjs(date).subtract(days, 'day').hour(12).toDate();
};
