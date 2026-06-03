import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname.startsWith('/login')
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')
  const isOnSeller = req.nextUrl.pathname.startsWith('/seller')

  if (isOnLoginPage) {
    if (isLoggedIn) {
      const role = req.auth?.user?.role
      if (role === 'ADMIN') return Response.redirect(new URL('/admin', req.nextUrl))
      if (role === 'SELLER') return Response.redirect(new URL('/seller', req.nextUrl))
      return Response.redirect(new URL('/', req.nextUrl))
    }
    return null
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL(`/login?callbackUrl=${req.nextUrl.pathname}`, req.nextUrl))
  }

  // Role based access control
  const role = req.auth?.user?.role
  
  if (isOnAdmin && role !== 'ADMIN') {
    return Response.redirect(new URL('/seller', req.nextUrl))
  }
  
  if (isOnSeller && role !== 'SELLER') {
    return Response.redirect(new URL('/admin', req.nextUrl))
  }
  
  // Root path redirect
  if (req.nextUrl.pathname === '/') {
    if (role === 'ADMIN') return Response.redirect(new URL('/admin', req.nextUrl))
    if (role === 'SELLER') return Response.redirect(new URL('/seller', req.nextUrl))
  }

  return null
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
