import { ErrorBoundary } from '@/errors';
import ErrorFallbackPage from '@/pages/ErrorFallbackPage';
import AppRoutes from './AppRoutes';

export default function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <ErrorFallbackPage error={error} onRetry={reset} />
      )}
      enableAutoRedirect={true}
      onError={(error, errorInfo) => {
        // 개발 환경에서 에러 로깅
        if (import.meta.env.DEV) {
          console.error('🚨 App Error Caught:', error);
          console.error('📍 Error Info:', errorInfo);
        }
      }}
    >
      <AppRoutes />
    </ErrorBoundary>
  );
}

