import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import '@/styles/globals.css';
import App from './App';
import { setupGlobalErrorHandlers, initializeSentry } from '@/errors';

// Sentry 초기화 (환경변수에서 DSN 가져오기)
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  initializeSentry(sentryDsn, {
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  });
}

//  전역 에러 핸들러 초기화
setupGlobalErrorHandlers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-center" />
    <App />
  </StrictMode>
);

