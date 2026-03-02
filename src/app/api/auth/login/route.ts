import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD!;

  // Constant-time comparison
  if (password.length !== expected.length) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  let match = 0;
  for (let i = 0; i < password.length; i++) {
    match |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }

  if (match !== 0) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createSessionToken();

  const response = NextResponse.json({ success: true });
  response.cookies.set('gp-admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  });

  return response;
}
