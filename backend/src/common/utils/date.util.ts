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

export const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};
