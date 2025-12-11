'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {  useRouter } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname() || '';
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isArabic = locale === 'ar';

  const getUserNameFromEmail = (email: string) => {
    return email.split('@')[0];
  };

  const userDisplayName = user ? getUserNameFromEmail(user.email) : '';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };


  const router = useRouter()

  const handleLogout = async() => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("https://raf-backend.vercel.app/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ token }),
      })

      console.log(response);
      
      if (response.ok) {
        localStorage.removeItem("token")
        document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        router.push("/login")
      }
    } catch (error) {
      console.error("Error during logout:", error)
    }
    logout();
    setUserMenuOpen(false);
    closeMenu();
  };

  const navItems = [
    { text: t('nav.home'), href: "/", active: pathname === `/${locale}` || pathname === `/${locale}/` },
    { text: t('nav.projects'), href: "/projects", active: pathname === `/${locale}/projects` || pathname.startsWith(`/${locale}/projects/`) },
    // { text: t('projects.projectsLocationMap'), href: "/projects-map", active: pathname === `/${locale}/projects-map` },
    { text: t('nav.maintenance'), href: "/building_maintenance", active: pathname === `/${locale}/building_maintenance` },
    { text: t('nav.contact'), href: "/contact", active: pathname === `/${locale}/contact` },
    { text: t('nav.about'), href: "/about", active: pathname === `/${locale}/about` },
    { text: t('nav.blog'), href: "/blogs", active: pathname === `/${locale}/blogs` },
    { text: t('nav.wishlist'), href: "/wishlist", active: pathname === `/${locale}/wishlist` },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#540f6b] backdrop-blur-md shadow-lg py-1 translate-y-0 ' 
          : 'bg-[#540f6b] backdrop-blur-sm py-1 lg:translate-y-0'
      } ${isMenuOpen ? 'translate-y-0' : '-translate-y-1'}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Gradient border at top with animation */}
      {/* <div className="h-1 bg-gradient-to-r from-[#c48765] via-[#540f6b] to-[#c48765] bg-[length:200%_auto] animate-gradient"></div> */}
      
      <div className="container mx-auto px-4 flex justify-between items-center text-white">
        <Link href="/" className="flex items-center group relative overflow-hidden rounded-lg">
          <div className="relative overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo3.png"
              alt="RAF Advanced Logo"
              width={125}
              height={50}
              className={`transition-all duration-300 ${isArabic ? 'ml-2' : 'mr-2'}`}
            />
          </div>
        </Link>

        {/* Desktop Menu with refined animations */}
        <div className={`hidden lg:flex items-center ${isArabic ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg overflow-hidden ${
                item.active
                  ? 'text-white bg-[#c48765]/10'
                  : 'text-white hover:text-white hover:bg-[#c48765]/5'
              }`}
            >
              <span className="relative z-10">{item.text}</span>
              {item.active && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c48765] rounded-full transform origin-left transition-transform scale-x-100" />
              )}
            </Link>
          ))}

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={toggleUserMenu}
                className={`flex items-center px-4 py-2.5 text-sm font-medium text-white hover:text-[#c48765] transition-all duration-300 rounded-lg hover:bg-[#c48765]/5 ${userMenuOpen ? 'bg-[#c48765]/10 text-[#c48765]' : ''} transform hover:scale-[1.02]`}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#540f6b] to-[#4a3340] rounded-full flex items-center justify-center text-white mr-2 shadow-md ring-2 ring-white/10">
                  {userDisplayName.charAt(0).toUpperCase()}
                </div>
                <span className={`${isArabic ? 'ml-1' : 'mr-1'} transition-transform duration-300 group-hover:translate-x-0.5`}>{userDisplayName}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''} ml-1 text-white`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`absolute ${isArabic ? 'right-0' : 'left-0'} mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50 transition-all duration-300 transform origin-top-right ${
                  userMenuOpen 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 -translate-y-2 invisible'
                }`}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-[#540f6b]">{userDisplayName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link 
                  href="/wishlist" 
                  className="flex items-center px-4 py-2.5 text-sm text-[#540f6b] hover:bg-[#c48765]/5 hover:text-[#c48765] transition-all duration-200 group"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">{t('nav.wishlist')}</span>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">{t('auth.nav.logout')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className={`flex items-center ${isArabic ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <Link
                href="/auth/login"
                className={`px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg transform hover:scale-[1.02] ${
                  pathname === "/auth/login"
                    ? 'text-white bg-[#c48765]/10'
                    : 'text-white hover:text-[#c48765] hover:bg-[#c48765]/5'
                }`}
              >
                {t('auth.nav.login')}
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-[#540f6b] to-[#4a3340] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:from-[#2a1c26] hover:to-[#3d2a34] transition-all shadow-md"
              >
                {t('auth.nav.signup')}
              </Link>
            </div>
          )}

          <Link
            href="/"
            locale={isArabic ? 'en' : 'ar'}
            className="flex items-center justify-center w-10 h-10 text-sm font-medium text-white hover:text-[#c48765] transition-colors rounded-full hover:bg-[#c48765]/5"
            aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <span className="font-semibold">{isArabic ? 'EN' : 'عربي'}</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          <Link
            href="/"
            locale={isArabic ? 'en' : 'ar'}
            className="flex items-center justify-center w-10 h-10 text-sm font-medium text-white hover:text-[#c48765] transition-colors rounded-full hover:bg-[#c48765]/5"
            aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <span className="font-semibold">{isArabic ? 'EN' : 'عربي'}</span>
          </Link>
          
          <button
            className="p-2 text-white focus:outline-none rounded-lg hover:bg-[#c48765]/5"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 flex flex-col items-end justify-center gap-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-300 ease-out ${isMenuOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ease-out ${isMenuOpen ? 'w-0 opacity-0' : 'w-4'}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ease-out ${isMenuOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-5'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out transform ${
          isMenuOpen 
            ? 'max-h-[500px] opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-4'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                  item.active
                    ? 'text-[#c48765] bg-[#c48765]/10'
                    : 'text-[#540f6b] hover:bg-[#c48765]/5 hover:text-[#c48765]'
                }`}
                onClick={closeMenu}
              >
                <span className="relative z-10">{item.text}</span>
              </Link>
            ))}

            {user ? (
              <>
                <div className="px-4 py-3 mt-2 mb-1 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#540f6b] to-[#4a3340] rounded-full flex items-center justify-center text-white mr-3 shadow-md ring-2 ring-white/10">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#540f6b]">{userDisplayName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/wishlist"
                  className="px-4 py-3 text-sm font-medium text-[#540f6b] hover:bg-[#c48765]/5 hover:text-[#c48765] rounded-lg transition-all duration-200 flex items-center group transform hover:scale-[1.02]"
                  onClick={closeMenu}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">{t('nav.wishlist')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-sm font-medium text-left text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full flex items-center group transform hover:scale-[1.02]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">{t('auth.nav.logout')}</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-2 pt-2 border-t border-gray-100">
                <Link
                  href="/auth/login"
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                    pathname === "/auth/login"
                      ? 'text-[#c48765] bg-[#c48765]/10'
                      : 'text-[#540f6b] hover:bg-[#c48765]/5 hover:text-[#c48765]'
                  }`}
                  onClick={closeMenu}
                >
                  {t('auth.nav.login')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-[#540f6b] to-[#4a3340] text-white px-4 py-3 rounded-lg text-sm font-medium text-center hover:from-[#2a1c26] hover:to-[#3d2a34] transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] duration-300"
                  onClick={closeMenu}
                >
                  {t('auth.nav.signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}