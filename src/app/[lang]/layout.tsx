import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ReactQueryProvider } from './providers';
import Navbar from '@/layouts/components/Navbar';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'React Movie App',
  description: 'A movie discovery app built with Next.js',
  icons: {
    icon: '/vite.svg',
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReactQueryProvider>
          <div className="min-h-screen bg-background text-foreground overflow-y-auto relative">
            <Navbar lang={lang} />
            <main className="max-w-6xl mx-auto px-4 py-6 relative z-10">
              {children}
            </main>
          </div>
          <Toaster position="top-center" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
