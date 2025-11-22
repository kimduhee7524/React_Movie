'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/constants/navLinks';

interface NavLinksProps {
  lang: string;
}

export default function NavLinks({ lang }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:flex gap-6">
      {NAV_LINKS.map(({ path, label }) => {
        const href = `/${lang}${path === '/' ? '' : path}`;
        const isActive = pathname === href;
        
        return (
          <Link
            key={path}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`text-sm font-semibold px-3 py-2 rounded-xl transition-all duration-300 hip-hover ${
              isActive
                ? 'text-accent bg-accent/10 neon-border'
                : 'text-muted-foreground hover:text-accent hover:bg-accent/5'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
