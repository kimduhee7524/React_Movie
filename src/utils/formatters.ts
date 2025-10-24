// 분 단위를 시간과 분으로 포맷팅
export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// 숫자를 미국 달러 통화 형식으로 포맷팅
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

// 날짜를 지역화된 형식으로 포맷팅
export const formatDate = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 숫자를 천 단위 구분자가 있는 형식으로 포맷팅
export const formatNumber = (number: number): string => {
  return number.toLocaleString();
};
