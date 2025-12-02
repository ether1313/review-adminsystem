import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");

  if (!table) {
    return NextResponse.json({ reviews: [], error: "Missing table name" });
  }

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ reviews: [], error: error.message });
  }

  return NextResponse.json({ reviews: data });
}
