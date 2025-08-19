import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota de paginação inválida para /todos
  if (pathname.match(/^\/todos\/(\d+)$/)) {
    const page = parseInt(pathname.split('/')[2]);
    
    // Se a página for 1, redirecionar para a raiz
    if (page === 1) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Se a página for 0 ou negativa, redirecionar para a raiz
    if (page <= 0) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Verificar se é uma rota de paginação inválida para localizados
  if (pathname.match(/^\/localizados\/(\d+)$/)) {
    const page = parseInt(pathname.split('/')[2]);
    
    // Se a página for 1, redirecionar para /localizados
    if (page === 1) {
      return NextResponse.redirect(new URL('/localizados', request.url));
    }
    
    // Se a página for 0 ou negativa, redirecionar para /localizados
    if (page <= 0) {
      return NextResponse.redirect(new URL('/localizados', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
