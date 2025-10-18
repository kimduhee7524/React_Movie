import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import '@/styles/globals.css';
import App from './App';
import { setupGlobalErrorHandlers } from '@/errors';

//  전역 에러 핸들러 초기화
setupGlobalErrorHandlers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-center" />
    <App />
  </StrictMode>
);

