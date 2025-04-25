import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth_token')?.value;

  if (pathname.startsWith('/admin')) {
    if (!authToken || authToken !== 'super_secure_token_123') {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};