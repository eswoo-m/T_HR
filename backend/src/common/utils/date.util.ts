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
  return dayjs(date).format('YYYY-MM-DD');
};

// 프론트엔드의 문자열을 DB용 Date 객체로 변환 (받을 때)
export const parseDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr || dateStr.trim() === '') return null;
  const parsed = dayjs(dateStr);
  return parsed.isValid() ? parsed.toDate() : null;
};