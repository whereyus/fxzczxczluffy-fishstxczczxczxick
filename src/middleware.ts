import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Panel sayfasına erişimi kontrol et
  if (request.nextUrl.pathname.startsWith('/sdadasddddaadsdsa/panel')) {
    // Cookie'den auth durumunu kontrol et
    const authCookie = request.cookies.get('adminAuth');
    
    if (!authCookie || authCookie.value !== 'true') {
      // Yetkisiz erişimde login sayfasına yönlendir
      return NextResponse.redirect(new URL('/sdadasddddaadsdsa', request.url));
    }
  }

  // /admin yolunu engelle
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/sdadasddddaadsdsa/:path*', '/admin/:path*'],
}; 