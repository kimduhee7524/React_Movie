import { Link, useLocation } from "react-router-dom";
import { navLinks } from "@/constants/navLinks";
import SearchInput from "@/components/share/SearchInput";

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <nav className="hidden sm:flex gap-4">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                aria-current={location.pathname === path ? "page" : undefined}
                className={`text-sm font-medium transition ${
                  location.pathname === path
                    ? "text-black underline"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center">
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
