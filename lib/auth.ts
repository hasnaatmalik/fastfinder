import {jwtVerify, SignJWT} from "jose";
import type {NextResponse} from "next/server";
import {cookies} from "next/headers";

// Clean up the JWT_SECRET by removing line breaks and extra spaces
const JWT_SECRET = (process.env.JWT_SECRET || "your-secret-key").replace(
  /\s+/g,
  ""
);
const JWT_EXPIRES_IN = "7d";

// Create JWT token
export function createToken(userId: string) {
  const token = new SignJWT({sub: userId})
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(new TextEncoder().encode(JWT_SECRET));

  return token;
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    const {payload} = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// Get current user ID from token
export async function getCurrentUserId() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  return payload?.sub || null;
}

// Set auth cookie
export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return response;
}

// Clear auth cookie
export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
