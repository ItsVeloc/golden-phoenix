import { NextRequest, NextResponse } from 'next/server';
import { validateSessionToken } from '@/lib/auth';

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get('gp-admin-session');
  if (!session) return false;
  return validateSessionToken(session.value);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect admin pages
  if (pathname.startsWith('/admin')) {
    if (!(await isAuthenticated(request))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect admin API routes (but not POST /api/bookings which is public)
  if (
    pathname.startsWith('/api/tables') ||
    (pathname.startsWith('/api/bookings') && request.method !== 'POST')
  ) {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/tables/:path*', '/api/bookings/:path*'],
};
