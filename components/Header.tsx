'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => pathname === path;

  

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };
  return (
    // <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm">
    //   <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    //     <div className="flex items-center space-x-8">
    //       <Link href="/" className="text-red-600 text-2xl font-bold">
    //         TFLIX
    //       </Link>
          
    //       <nav className="hidden md:flex space-x-6">
    //         <Link
    //           href="/"
    //           className={`hover:text-white transition ${
    //             isActive('/') ? 'text-white' : 'text-gray-400'
    //           }`}
    //         >
    //           Home
    //         </Link>
    //         <Link
    //           href="/movies"
    //           className={`hover:text-white transition ${
    //             isActive('/movies') ? 'text-white' : 'text-gray-400'
    //           }`}
    //         >
    //           Movies
    //         </Link>
    //         <Link
    //           href="/tv-shows"
    //           className={`hover:text-white transition ${
    //             isActive('/tv-shows') ? 'text-white' : 'text-gray-400'
    //           }`}
    //         >
    //           TV Shows
    //         </Link>
    //         <Link
    //           href="/anime"
    //           className={`hover:text-white transition ${
    //             isActive('/anime') ? 'text-white' : 'text-gray-400'
    //           }`}
    //         >
    //           Anime
    //         </Link>
    //       </nav>
    //     </div>

    //     <form onSubmit={handleSearch} className="relative">
    //       <input
    //         type="text"
    //         placeholder="Search..."
    //         value={searchQuery}
    //         onChange={(e) => setSearchQuery(e.target.value)}
    //         className="bg-gray-900 text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 w-64"
    //       />
    //       <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
    //         <Search className="w-4 h-4 text-gray-400" />
    //       </button>
    //     </form>
    //   </div>
    // </header>

    <nav className=" fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-red-600 text-3xl font-bold tracking-wider">
              TFLIX
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/" 
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/movies" 
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Movies
              </Link>
              <Link 
                href="/tv-shows" 
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                TV Shows
              </Link>
              <Link 
                href="/anime" 
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Anime
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-black/50 border-white/10 text-white placeholder:text-white/50 focus:border-white/30 pr-10"
                />
                <button
                  type="submit"
                  // size="sm"
                  // variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                >
                  <Search className="h-4 w-4 text-white/70" />
                </button>
              </div>
            </form>

            <button
              // variant="ghost"
              // size="sm"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-sm text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/movies" 
                className="text-sm text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                href="/tv-shows" 
                className="text-sm text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                TV Shows
              </Link>
              <Link 
                href="/anime" 
                className="text-sm text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Anime
              </Link>
              
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 text-white px-4 py-3 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button type="submit"  className="text-white">
                  <Search className="h-9 w-4 " />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
