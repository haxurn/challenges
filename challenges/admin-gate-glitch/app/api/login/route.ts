import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (username === 'superadmin' && password === 'supersecretpassword') {
      const response = NextResponse.json({ message: 'Logged in successfully', role: 'admin' }, { status: 200 });
      response.cookies.set('auth_token', 'super_secure_token_123', {
        path: '/',
        httpOnly: true,
      });
      return response;
    }
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ message: 'System error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
