import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// 需要保护的路由
const protectedRoutes = [
  "/courses",
  "/schedule",
  "/my-requests",
  "/course-request",
];

// 管理员路由
const adminRoutes = ["/admin"];

// 公开路由
const publicRoutes = ["/login", "/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是公开路由
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 获取会话令牌
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 如果没有令牌，重定向到登录页面
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // 检查管理员路由
  if (
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    token.role !== "admin"
  ) {
    // 如果不是管理员，重定向到课程页面
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  return NextResponse.next();
}

// 配置匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - api 路由
     * - 静态文件 (如 /vercel.svg)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
