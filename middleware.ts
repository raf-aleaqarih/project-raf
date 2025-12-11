import createMiddleware from 'next-intl/middleware';
import { locales } from './config/i18n';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'ar',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to static files and assets
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/public') || 
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return intlMiddleware(request);
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};