export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    "/",
    "/brief/:path*",
    "/calendar/:path*",
    "/classes/:path*",
    "/practice/:path*",
    "/settings/:path*",
  ],
}
