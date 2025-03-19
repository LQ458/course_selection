import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // 允许访问登录页面
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // 验证管理员权限
    if (pathname.startsWith("/admin")) {
      if (!token?.role || token.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/admin/:path*"],
};
