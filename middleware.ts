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

  console.log(`Middleware processing path: ${pathname}`);

  // Get token from cookie
  const token = request.cookies.get("auth_token")?.value;

  if (token) {
    console.log("Token found in cookie");
  } else {
    console.log("No token found in cookie");
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  console.log(`isProtectedPath: ${isProtectedPath}, isAuthPath: ${isAuthPath}`);

  // If it's a protected path and no token exists, redirect to login
  if (isProtectedPath) {
    if (!token) {
      console.log("Protected path with no token, redirecting to login");
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", encodeURIComponent(pathname));
      return NextResponse.redirect(url);
    }

    try {
      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        console.log("Token verification failed, redirecting to login");
        // Token is invalid, clear it and redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("auth_token");
        return response;
      }

      console.log("Token verified successfully for protected path");
    } catch (error) {
      console.error("Token verification error in middleware:", error);
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
        console.log("User already logged in on auth path");
        // Don't redirect if there's a specific redirect parameter
        if (
          pathname === "/login" &&
          request.nextUrl.searchParams.has("redirect")
        ) {
          const redirectPath = request.nextUrl.searchParams.get("redirect");
          console.log(`Redirecting to specific path: ${redirectPath}`);
          return NextResponse.redirect(
            new URL(decodeURIComponent(redirectPath || ""), request.url)
          );
        }
        console.log("Redirecting to dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error(
        "Token verification error in middleware (auth path):",
        error
      );
      // Continue to auth page if token verification fails
    }
  }

  console.log("Proceeding with request");
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
