import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ReactQueryProvider } from './providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'React Movie App',
  description: 'A movie discovery app built with Next.js',
  icons: {
    icon: '/vite.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Toaster position="top-center" />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
