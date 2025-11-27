import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  // 🔒 Protect admin pages
  if (path.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 🔒 Protect user dashboard
  if (path.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
