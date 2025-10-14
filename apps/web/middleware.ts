import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./actions/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  const { pathname, searchParams } = req.nextUrl;

  // Check if user is trying to access auth pages
  const isAuthPage = pathname.startsWith("/auth");

  // If user is logged in and trying to access auth pages, stay on current page
  if (session && session.user && isAuthPage) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (isProtectedRoute && (!session || !session.user)) {
    // Preserve the original URL as callbackUrl for redirect after login
    const callbackUrl = encodeURIComponent(
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    );
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
