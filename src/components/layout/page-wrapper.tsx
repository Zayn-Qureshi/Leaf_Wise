'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <main className="flex-1">
      <div className={cn(!isHomePage && 'leafy-background')}>
        {children}
      </div>
    </main>
  );
}
