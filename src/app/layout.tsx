import { PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { PageWrapper } from '@/components/layout/page-wrapper';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>LeafWise</title>
        <meta name="description" content="Identify plants with a snap!" />

      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', ptSans.variable)}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <PageWrapper>
            {children}
          </PageWrapper>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
