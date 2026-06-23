export { auth as proxy } from "@/lib/auth"

export const config = {
  // Protect all routes except API, static assets, and media files
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}