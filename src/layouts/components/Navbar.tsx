import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '@/constants/navLinks';
import SearchInput from '@/components/share/SearchInput';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 shadow-lg glow-purple-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl bounce-cute">🎬</span>
            <span className="text-xl font-bold text-accent hidden sm:block">
              Movie
            </span>
          </div>
          <nav className="hidden sm:flex gap-6">
            {NAV_LINKS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                aria-current={location.pathname === path ? 'page' : undefined}
                className={`text-sm font-semibold px-3 py-2 rounded-xl transition-all duration-300 hip-hover ${
                  location.pathname === path
                    ? 'text-accent bg-accent/10 neon-border'
                    : 'text-muted-foreground hover:text-accent hover:bg-accent/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SearchInput />
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary animate-pulse"></div>
        </div>
      </div>
    </header>
  );
}
