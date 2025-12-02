import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { brand_name, username, password } = await req.json();

    if (!brand_name || !username || !password) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Check duplicate username under same brand
    const { data: exists } = await supabase
      .from("brands_credentials")
      .select("*")
      .eq("brand_name", brand_name)
      .eq("username", username)
      .maybeSingle();

    if (exists) {
      return NextResponse.json(
        { success: false, message: "Username already exists under this brand." },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("brands_credentials").insert([
      {
        brand_name,
        username,
        password,
        review_table: `${brand_name}_reviews`
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
