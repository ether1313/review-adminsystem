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

    // Check if brand already registered
    const { data: existingBrand } = await supabase
      .from("brands_credentials")
      .select("brand_name")
      .eq("brand_name", brand_name)
      .maybeSingle();

    if (existingBrand) {
      return NextResponse.json(
        {
          success: false,
          message: `Brand "${brand_name}" is already registered. Please contact admin.`,
        },
        { status: 409 }
      );
    }

    // Check duplicate username under brand
    const { data: exists } = await supabase
      .from("brands_credentials")
      .select("*")
      .eq("brand_name", brand_name)
      .eq("username", username)
      .maybeSingle();

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists under this brand.",
        },
        { status: 409 }
      );
    }

    // review_table = lowercase + _review
    const lowercaseTable = `${brand_name.toLowerCase()}_review`;

    // Insert new user
    const { error } = await supabase.from("brands_credentials").insert([
      {
        brand_name, // keep original casing
        username,
        password,
        review_table: lowercaseTable,
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
