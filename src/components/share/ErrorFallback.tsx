'use client';

import { BaseError, getErrorContent, classifyError } from '@/errors';

interface ErrorFallbackProps {
  error: BaseError;
  resetErrorBoundary?: () => void;
  title?: string;
  description?: string;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title,
  description,
}: ErrorFallbackProps) {
  const errorContent = getErrorContent(error, {
    title,
    description,
  });

  // 개발 환경용 ErrorKind
  const errorKind = classifyError(error);

  // 개발 환경에서만 상세 정보 표시
  const showDetails = process.env.NODE_ENV !== 'production';

  return (
    <div className="p-6 bg-red-50 border border-red-300 rounded-lg text-red-700 max-w-2xl mx-auto my-8 overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-3xl">{errorContent.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg mb-2">{errorContent.title}</p>
          <p className="text-sm mb-2 text-red-600">
            {errorContent.description}
          </p>
          <p className="text-sm mb-3">{errorContent.message}</p>

          {showDetails && (
            <details className="mt-4 p-3 bg-red-100 rounded text-xs">
              <summary className="cursor-pointer font-semibold mb-2">
                개발자 정보 (프로덕션에서는 숨겨짐)
              </summary>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="font-semibold">ErrorKind:</span> {errorKind}
                </div>
                <div>
                  <span className="font-semibold">에러 코드:</span> {error.code}
                </div>
                <div>
                  <span className="font-semibold">심각도:</span>{' '}
                  {error.severity}
                </div>
                <div>
                  <span className="font-semibold">타임스탬프:</span>{' '}
                  {error.metadata.timestamp.toLocaleString()}
                </div>
                {error.metadata.additionalData && (
                  <div>
                    <span className="font-semibold">추가 정보:</span>
                    <pre className="mt-1 p-2 bg-white rounded overflow-x-auto max-w-full text-xs">
                      {JSON.stringify(error.metadata.additionalData, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <span className="font-semibold">스택 트레이스:</span>
                  <pre className="mt-1 p-2 bg-white rounded overflow-x-auto max-h-40 max-w-full text-xs break-all">
                    {error.stack}
                  </pre>
                </div>
              </div>
            </details>
          )}

          {resetErrorBoundary && (
            <button
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              onClick={resetErrorBoundary}
            >
              {errorContent.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
