import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";
import { prefetchBlogsList } from "../pages/Blog";

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-6 h-5 flex flex-col justify-between">
      <span 
        className={`block h-[2px] bg-current transition-all duration-300 origin-center ${
          isOpen ? 'rotate-45 translate-y-[9px]' : ''
        }`}
      />
      <span 
        className={`block h-[2px] bg-current transition-all duration-300 ${
          isOpen ? 'opacity-0 scale-0' : ''
        }`}
      />
      <span 
        className={`block h-[2px] bg-current transition-all duration-300 origin-center ${
          isOpen ? '-rotate-45 -translate-y-[9px]' : ''
        }`}
      />
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`relative hover:text-muted pb-2 ${isActive ? 'text-accent' : ''}`}
    >
      {children}
      <span 
        className={`absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-300 ${
          isActive ? 'w-full' : 'w-0'
        }`}
      />
    </Link>
  );
}

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-sm">
        <nav className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-display hover:text-muted tracking-wide">
            Darasimi
          </Link>
          
          {/* Desktop nav */}
          <div className="hidden md:flex gap-6">
            <NavLink to="/projects">Projects</NavLink>
            <Link 
              to="/blog"
              onMouseEnter={prefetchBlogsList}
              className={`relative hover:text-muted pb-2 ${location.pathname === '/blog' ? 'text-accent' : ''}`}
            >
              Blog
              <span 
                className={`absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-300 ${
                  location.pathname === '/blog' ? 'w-full' : 'w-0'
                }`}
              />
            </Link>
            <NavLink to="/about">About</NavLink>
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-muted"
            >
              Resume
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-secondary/50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <HamburgerIcon isOpen={isSidebarOpen} />
          </button>
        </nav>
      </header>

      {/* Mobile sidebar */}
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  );
}

export default Header;
