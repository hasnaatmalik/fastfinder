import type {NextRequest, NextResponse} from "next/server";
import {jwtVerify, SignJWT} from "jose";
import {User} from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "7d";

// Create JWT token
export async function createToken(payload: any) {
  const token = await new SignJWT(payload)
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
    return null;
  }
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

// Get current user from token
export async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    if (!payload || !payload.sub) {
      return null;
    }

    const user = await User.findById(payload.sub).select("-password");
    return user;
  } catch (error) {
    return null;
  }
}
