import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ['ko', 'en', 'ja'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 이미 언어 경로가 있는지 확인 
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // 없으면 ko로 리다이렉트
  const locale = 'ko';
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
