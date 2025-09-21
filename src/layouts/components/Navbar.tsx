import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '@/constants/navLinks';
import { LANGUAGE_OPTIONS } from '@/constants/selectOptions';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { movieQueries } from '@/queries/movieQueries';
import SearchInput from '@/components/share/SearchInput';
import SelectBox from '@/components/share/SelectBox';
import { useQueryClient } from '@tanstack/react-query';

export default function Navbar() {
  const location = useLocation();
  const { language, setLanguage } = useLanguageStore();
  const queryClient = useQueryClient();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    queryClient.invalidateQueries({ queryKey: movieQueries.keys.all });
  };

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
          <div className="hidden sm:block">
            <SelectBox
              value={language}
              onChange={handleLanguageChange}
              options={LANGUAGE_OPTIONS}
              placeholder="언어 선택"
            />
          </div>
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
