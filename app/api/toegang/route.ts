import { NextResponse } from 'next/server';
import { COOKIE_DUUR, COOKIE_NAAM, rolVoorCode } from '@/lib/auth';

export async function POST(request: Request) {
  let code = '';

  try {
    const body = (await request.json()) as { code?: unknown };
    if (typeof body.code === 'string') code = body.code;
  } catch {
    return NextResponse.json({ fout: 'Ongeldig verzoek' }, { status: 400 });
  }

  const rol = rolVoorCode(code);

  if (!rol) {
    return NextResponse.json({ fout: 'Deze code klopt niet.' }, { status: 401 });
  }

  const response = NextResponse.json({ rol });

  response.cookies.set({
    name: COOKIE_NAAM,
    value: rol,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_DUUR,
  });

  return response;
}
