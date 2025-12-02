import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  const username = cookieStore.get("username")?.value || "";
  const role = cookieStore.get("role")?.value || "";

  const isSuperAdmin =
    username === "superadmin" && role === "superadmin";

  return NextResponse.json({ superadmin: isSuperAdmin });
}
