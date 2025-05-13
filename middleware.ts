import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {verifyToken} from "./lib/auth-edge";

// List of paths that require authentication
const protectedPaths = ["/dashboard", "/report", "/my-items", "/item"];

// List of paths that should redirect to dashboard if already authenticated
const authPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify",
];

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get("auth_token")?.value;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // If it's a protected path and no token exists, redirect to login
  if (isProtectedPath) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", encodeURIComponent(pathname));
      return NextResponse.redirect(url);
    }

    try {
      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        // Token is invalid, clear it and redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("auth_token");
        return response;
      }
    } catch (error) {
      // Token verification failed, redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // If it's an auth path and user is already logged in, redirect to dashboard
  if (isAuthPath && token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        // Don't redirect if there's a specific redirect parameter
        if (
          pathname === "/login" &&
          request.nextUrl.searchParams.has("redirect")
        ) {
          const redirectPath = request.nextUrl.searchParams.get("redirect");
          return NextResponse.redirect(
            new URL(decodeURIComponent(redirectPath || ""), request.url)
          );
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      // Continue to auth page if token verification fails
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
