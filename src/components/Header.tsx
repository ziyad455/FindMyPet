// Header component with navigation and language toggle
// Includes responsive mobile menu with GSAP animations

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth, useLanguage } from '../context';

export const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate mobile menu
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (mobileMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(
          mobileMenuRef.current.children,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.2, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
        );
      }
    }
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'text-primary-600 bg-primary-50'
        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
    }`;

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg shadow-gray-100/50'
          : 'bg-white shadow-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🐾</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                {t('common.appName')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <Link to="/" className={navLinkClass('/')}>
              {t('header.home')}
            </Link>

            {user && (
              <>
                {isAdmin ? (
                  /* Admin only sees Admin Dashboard */
                  <Link to="/admin" className={navLinkClass('/admin')}>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {t('header.admin')}
                    </span>
                  </Link>
                ) : (
                  /* Regular users see Dashboard and Add Pet */
                  <>
                    <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                      {t('header.dashboard')}
                    </Link>
                    <Link to="/submit" className={navLinkClass('/submit')}>
                      {t('header.addPet')}
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium">
                    {(user.displayName || user.email)?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-700 font-medium max-w-[120px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
                >
                  {t('common.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden py-4 border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('header.home')}
              </Link>

              {user && (
                <>
                  {isAdmin ? (
                    /* Admin only sees Admin Dashboard */
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/admin') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t('header.admin')}
                    </Link>
                  ) : (
                    /* Regular users see Dashboard and Add Pet */
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive('/dashboard') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {t('header.dashboard')}
                      </Link>
                      <Link
                        to="/submit"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive('/submit') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {t('header.addPet')}
                      </Link>
                    </>
                  )}
                </>
              )}

              <button
                onClick={toggleLanguage}
                className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 text-start hover:bg-gray-50 transition-colors"
              >
                {language === 'fr' ? 'العربية' : 'Français'}
              </button>

              <hr className="my-2 border-gray-100" />

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 text-start transition-colors"
                >
                  {t('common.logout')}
                </button>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-primary-600 text-center border border-primary-200 hover:bg-primary-50 transition-colors"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 text-center transition-colors"
                  >
                    {t('common.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
