import SearchInput from '@/components/share/SearchInput';
import LanguageSwitcher from './LanguageSwitcher';
import NavLinks from './NavLinks';

interface NavbarProps {
  lang: string;
}

export default function Navbar({ lang }: NavbarProps) {
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
          <NavLinks lang={lang} />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher lang={lang} />
          </div>
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
