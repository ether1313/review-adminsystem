import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const brandName = req.cookies.get("brand_name")?.value;
  const reviewTable = req.cookies.get("review_table")?.value;

  // 保护所有 /admin 路径（除了 login 页）
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!brandName || !reviewTable) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// 哪些路径需要应用 middleware
export const config = {
  matcher: [
    "/admin/:path*", // 保护整个 /admin 目录
  ],
};
