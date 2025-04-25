import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('auth_token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });
  return response;
}
