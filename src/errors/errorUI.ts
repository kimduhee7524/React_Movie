import { BaseError } from './types/BaseError';
import { classifyError } from './errorClassify';
import type { ErrorKind } from './types/errorKinds';

// 에러 UI 콘텐츠
export interface ErrorContent {
  // 아이콘
  icon: string;
  // 제목
  title: string;
  // 설명
  description: string;
  // 사용자 메시지
  message: string;
  // 액션 레이블 (버튼 텍스트)
  actionLabel: string;
}

// ErrorKind별 기본 콘텐츠 맵
const ERROR_CONTENT_MAP: Record<ErrorKind, Omit<ErrorContent, 'message'>> = {
  ClientError: {
    icon: '🐛',
    title: '클라이언트 오류',
    description: '페이지를 새로고침해주세요.',
    actionLabel: '새로고침',
  },
  ApiError: {
    icon: '🔧',
    title: 'API 오류',
    description: 'API 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    actionLabel: '다시 시도',
  },
  NetworkError: {
    icon: '📡',
    title: '네트워크 오류',
    description: '인터넷 연결을 확인해주세요.',
    actionLabel: '다시 시도',
  },
  UnknownError: {
    icon: '❓',
    title: '알 수 없는 오류',
    description:
      '예상치 못한 문제가 발생했습니다. 페이지를 새로고침하거나 관리자에게 문의해주세요.',
    actionLabel: '새로고침',
  },
};

// 에러 객체에서 UI 콘텐츠 추출
export function getErrorContent(
  error: BaseError,
  overrides?: Partial<ErrorContent>
): ErrorContent {
  // ErrorKind 추출
  const errorKind = classifyError(error);

  //  ErrorKind별 기본 콘텐츠 가져오기
  const baseContent = ERROR_CONTENT_MAP[errorKind];

  //  사용자 메시지 가져오기
  const userMessage = error.getUserMessage();

  //  오버라이드 적용
  return {
    icon: overrides?.icon ?? baseContent.icon,
    title: overrides?.title ?? baseContent.title,
    description: overrides?.description ?? baseContent.description,
    message: overrides?.message ?? userMessage,
    actionLabel: overrides?.actionLabel ?? baseContent.actionLabel,
  };
}

// ErrorKind로 직접 콘텐츠 가져오기
export function getErrorContentByKind(
  errorKind: ErrorKind
): Omit<ErrorContent, 'message'> {
  return ERROR_CONTENT_MAP[errorKind];
}
