import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;
  
  if (token && (path.startsWith("/login") || path.startsWith("/signup"))) {
    return NextResponse.redirect(
        new URL(`/`, req.url)
      );
  }
  // 🔒 Protect admin pages
  if (path.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      const redirect = "/admin";
      return NextResponse.redirect(
        new URL(`/login?redurl=${redirect}`, req.url)
      );
    }
  }

  // 🔒 Protect user dashboard
  if (path.startsWith("/dashboard")) {
    if (!token) {
      const redirect = "/dashboard";
      return NextResponse.redirect(
        new URL(`/login?redurl=${encodeURI(redirect)}`, req.url)
      );
    }
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
