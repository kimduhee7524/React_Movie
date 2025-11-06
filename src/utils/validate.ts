export const validateSearchKeyword = (input: string): string | undefined => {
  const trimmed = input.trim();

  if (!trimmed) return '검색어를 입력해주세요.';
  if (trimmed.length < 2) return '검색어는 2글자 이상 입력해주세요.';
  if (trimmed.length > 100) return '검색어는 100글자 이하로 입력해주세요.';
  if (!/[a-zA-Z0-9가-힣]/.test(trimmed)) return '올바른 검색어를 입력해주세요.';

  return undefined;
};
