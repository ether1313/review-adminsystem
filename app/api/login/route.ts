import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const { data: brand, error } = await supabase
    .from("brands_credentials")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (!brand || error) {
    return NextResponse.json(
      { success: false, message: "Invalid username or password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });

  // 登录成功 → 写入 cookie
  res.cookies.set("brand_name", brand.brand_name, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  res.cookies.set("review_table", brand.review_table, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return res;
}
