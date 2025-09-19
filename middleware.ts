import { NextResponse, type NextRequest } from 'next/server'
import { verifySession } from '@/lib/session'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/home',
  '/about',
  '/contact',
  '/login',
  '/signup',
  '/phone-verification',
  '/_next',
  '/favicon.ico',
  '/api/auth'
]

export async function middleware(request: NextRequest) {
  // Create a response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { pathname } = request.nextUrl
  
  // Skip middleware for public routes and static files
  if (publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico')
  )) {
    // If user is logged in and tries to access login/signup, redirect to home
    if ((pathname === '/login' || pathname === '/signup') && request.cookies.has('sb-access-token')) {
      const url = request.nextUrl.clone()
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
    return response
  }

  // Check custom session for all protected routes
  const sessionToken = request.cookies.get('session')?.value || ''
  let sessionPayload: any = null
  
  if (sessionToken) {
    try {
      sessionPayload = await verifySession(sessionToken)
    } catch {
      // Invalid session token
    }
  }

  // Admin-only protection will be validated via /api/me below

  // Check if user is banned (for all protected routes)
  if (sessionPayload && !pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
    try {
      // Make a request to check if user is banned
      const checkResponse = await fetch(`${request.nextUrl.origin}/api/me`, {
        headers: {
          'Cookie': request.headers.get('cookie') || ''
        }
      })
      
      const checkData = await checkResponse.json()
      
      // If user is banned (me API returns null user), redirect to login with banned message
      if (!checkData.user && sessionPayload) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('banned', 'true')
        return NextResponse.redirect(url)
      }

      // Enforce admin access using live role from /api/me
      if (pathname.startsWith('/admin')) {
        if (!checkData.user || checkData.user.role !== 'admin') {
          const url = request.nextUrl.clone()
          url.pathname = '/login'
          url.searchParams.set('redirectedFrom', pathname)
          return NextResponse.redirect(url)
        }
      }
    } catch {
      // If check fails, continue normally
    }
  }

  // If no session and trying to access protected route, redirect to login
  if (!sessionPayload && !publicRoutes.some(route => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|public).*)',
  ],
}
