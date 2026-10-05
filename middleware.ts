import { NextRequest, NextResponse } from 'next/server';

/**
 * Route guard for the admin area.
 * Presence of the session cookie is checked here; the signature and expiry
 * are verified server-side in getSession() before any privileged action.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = req.cookies.get('alhass_session')?.value;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
