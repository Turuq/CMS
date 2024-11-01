import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { api } from './app/actions/api';
import { getPathFromRole } from './utils/helpers/get-path-from-role';

const handleI18nRouting = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en',
});

const isProtectedRoute = createRouteMatcher([
  '/:locale/courier-manager(.*)',
  '/:locale/handover-officer(.*)',
  '/:locale/assignment-officer(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const { pathname } = req.nextUrl;
  const [, locale] = pathname.split('/');

  if (!userId) {
    req.nextUrl.pathname = `/${locale}`;
    return handleI18nRouting(req as unknown as NextRequest);
  }

  const res = await api.auth.me.$post({ json: { userId } });
  const data = await res.json();

  if (!data) {
    // Handle unexpected empty data case
    return handleI18nRouting(req as unknown as NextRequest);
  }

  const role = getPathFromRole(data.role);

  if (isProtectedRoute(req)) {
    if (pathname.includes(role)) {
      return handleI18nRouting(req as unknown as NextRequest);
    } else {
      req.nextUrl.pathname = `/${locale}/${role}`;
    }
  } else {
    req.nextUrl.pathname =
      pathname === `/${locale}` && role ? `/${locale}/${role}` : `/${locale}`;
  }

  return handleI18nRouting(req as unknown as NextRequest);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*'],
};
