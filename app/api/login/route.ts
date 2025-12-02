import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // ============================================================
  // SUPERADMIN LOGIN
  // ============================================================
  if (username === "superadmin" && password === "superadmin888") {
    const res = NextResponse.json({ success: true, role: "superadmin" });

    res.cookies.set("username", "superadmin", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    res.cookies.set("role", "superadmin", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return res;
  }

  // ============================================================
  // NORMAL BRAND LOGIN
  // ============================================================
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

  const res = NextResponse.json({ success: true, role: "brand" });

  // Login Success → Write Cookies
  res.cookies.set("username", username, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  res.cookies.set("role", "brand", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

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
