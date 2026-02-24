import { NextResponse } from 'next/server';

export default function proxy(request) {
  const path = request.nextUrl.pathname;

  // 1. Protect the Volunteer Scanner Route
  if (path === '/admin/scanner') {
    const hasScannerAccess = request.cookies.get('scanner_session')?.value;
    
    if (!hasScannerAccess) {
      return NextResponse.redirect(new URL('/admin/scanner/login', request.url));
    }
  }

  // 2. Protect the Host Dashboard Route 
  if (path.startsWith('/admin/host') && path !== '/admin/host/login') {
    const hasHostAccess = request.cookies.get('host_session')?.value;
    
    if (!hasHostAccess) {
      return NextResponse.redirect(new URL('/admin/host/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};