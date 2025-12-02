import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Brand Admin cookies
  res.cookies.delete("brand_name");
  res.cookies.delete("review_table");

  // SuperAdmin cookies
  res.cookies.delete("username");
  res.cookies.delete("role");

  return res;
}
