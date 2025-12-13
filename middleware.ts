import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function middleware(req: NextRequest) {
  // This middleware only runs on /dashboard routes (see matcher config below)
  const token = req.cookies.get("authToken");

  // If no token, redirect to auth page
  if (!token || !token.value) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Verify JWT token
  try {
    jwt.verify(token.value, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    // Token is invalid or expired, redirect to auth page
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

// Only run middleware on specific routes (dashboard routes)
export const config = {
  matcher: [
    "/dashboard/:path*",
    // You can add other protected routes here
  ],
};
