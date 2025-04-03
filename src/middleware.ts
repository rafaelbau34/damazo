import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    jwt.verify(token, SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
