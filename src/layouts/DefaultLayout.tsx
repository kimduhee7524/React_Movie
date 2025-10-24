import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@/errors';
import ErrorFallback from '@/components/share/ErrorFallback';
import Navbar from './components/Navbar';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto relative">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        <ErrorBoundary
          fallback={(error, reset) => (
            <div className="min-h-[60vh] flex items-center justify-center">
              <ErrorFallback error={error} resetErrorBoundary={reset} />
            </div>
          )}
          onReset={() => window.location.reload()}
        >
          <Outlet />
        </ErrorBoundary>
      </main>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/3 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>
    </div>
  );
}
