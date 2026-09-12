import { NextResponse, type NextRequest } from 'next/server'

// Trailing/leading junk that breaks exact-path routing: ASCII whitespace plus
// invisible Unicode characters that search engines and copy-paste sometimes
// append. Strip and 308 to the clean path. Built from escapes so the source
// contains no literal invisible characters.
const EDGE_JUNK_CLASS = '[\\s\\u200B\\u200C\\u200D\\uFEFF]+'
const URL_EDGE_JUNK = new RegExp(`^${EDGE_JUNK_CLASS}|${EDGE_JUNK_CLASS}$`, 'g')

// Session cookie presence check only. No DB or auth library in the proxy.
const SESSION_COOKIES = ['__Secure-authjs.session-token', 'authjs.session-token']

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const cleaned = pathname.replace(URL_EDGE_JUNK, '')
  if (cleaned !== pathname && cleaned.length > 0) {
    const url = req.nextUrl.clone()
    url.pathname = cleaned
    return NextResponse.redirect(url, 308)
  }

  // Collapse trailing slashes (except root) to keep one canonical URL.
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/\/+$/, '')
    return NextResponse.redirect(url, 308)
  }

  // Phase 1: gate the portal behind sign-in.
  const isLoggedIn = SESSION_COOKIES.some((n) => req.cookies.get(n)?.value)
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // /ingest is the PostHog proxy: its paths end in a slash by design and must
  // not hit the trailing-slash redirect above.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|twitter-image|api/|ingest/).*)'],
}
