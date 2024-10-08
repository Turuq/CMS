import createMiddleware from "next-intl/middleware";
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { api } from './app/actions/api';
import { getPathFromRole } from './utils/helpers/get-path-from-role';
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, locale] = pathname.split('/');

  const token = cookies().get('token')?.value;
  if (!token && !pathname.endsWith(locale)) {
    request.nextUrl.pathname = `/${locale}`;
  } else {
    const res = await api.auth.me.$post({ json: { token: token ?? '' } });
    const data = await res.json();
    if (data) {
      const path = getPathFromRole(data.role);
      if (!pathname.includes(path)) {
        console.log(`unauthorized: redirecting to ${locale}/${path}`);
        request.nextUrl.pathname = `/${locale}/${path}`;
      }
    } else {
      request.nextUrl.pathname = `/${locale}`;
    }
  }

  const handleI18nRouting = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'ar'],

    // Used when no locale matches
    defaultLocale: 'en',
  });
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|en)/:path*"],
};
