import { Leaf } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-forest-600 rounded-xl flex items-center justify-center group-hover:bg-forest-700 transition-colors">
            <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-forest-800 text-lg tracking-tight">EcoQuest</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isHome
                ? 'text-forest-700 bg-forest-50'
                : 'text-stone-600 hover:text-forest-700 hover:bg-stone-50'
            }`}
          >
            Feed
          </Link>
          <Link
            to="/report"
            className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-forest-600 text-white hover:bg-forest-700 transition-colors"
          >
            + Report
          </Link>
        </nav>
      </div>
    </header>
  );
}
