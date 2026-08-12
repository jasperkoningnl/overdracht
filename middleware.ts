import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_NAAM, isRol } from '@/lib/auth';

const open = ['/toegang', '/api/toegang'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rol = request.cookies.get(COOKIE_NAAM)?.value;

  if (open.includes(pathname)) {
    // Al ingelogd? Dan hoeft het toegangsscherm niet meer.
    if (pathname === '/toegang' && isRol(rol)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!isRol(rol)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ fout: 'Geen toegang' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/toegang', request.url));
  }

  if (pathname.startsWith('/overzicht') && rol !== 'beheer') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // De fonts staan er bewust buiten: die verraden niets en moeten ook op het
  // toegangsscherm laden, waar nog geen cookie is.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts/).*)'],
};
