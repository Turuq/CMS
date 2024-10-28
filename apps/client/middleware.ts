import createMiddleware from 'next-intl/middleware';
import { api } from './app/actions/api';
import { getPathFromRole } from './utils/helpers/get-path-from-role';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

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
  } else {
    const res = await api.auth.me.$post({ json: { userId } });
    const data = await res.json();
    if (data) {
      const role = getPathFromRole(data.role);
      if (isProtectedRoute(req)) {
        if (pathname.includes(role)) {
          NextResponse.next();
        } else {
          req.nextUrl.pathname = `/${locale}/${role}`;
        }
      } else {
        NextResponse.next();
      }
    }
  }

  // if (userId && isProtectedRoute(req)) {
  //   console.log(`user is authenticated, route is protected`);
  //   const res = await api.auth.me.$post({ json: { userId } });
  //   const data = await res.json();
  //   if (data) {
  //     const role = getPathFromRole(data.role);
  //     if (pathname.includes(role)) {
  //       NextResponse.next();
  //     } else {
  //       req.nextUrl.pathname = `/${locale}/${role}`;
  //     }
  //   }
  // } else if (userId && !isProtectedRoute(req)) {
  //   console.log(`user is authenticated, route is not protected`);
  //   const res = await api.auth.me.$post({ json: { userId } });
  //   const data = await res.json();
  //   if (data) {
  //     const role = getPathFromRole(data.role);
  //     req.nextUrl.pathname = `/${locale}/${role}`;
  //   } else {
  //     req.nextUrl.pathname = `/${locale}`;
  //   }
  // } else {
  //   req.nextUrl.pathname = `/${locale}`;
  // }

  const response = handleI18nRouting(req as unknown as NextRequest);
  return response;
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*'],
};
