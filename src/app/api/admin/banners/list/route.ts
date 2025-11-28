import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "../../auth/route";

// GET: List all banners (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("promotional_banners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Error listing banners:", error);
    return NextResponse.json(
      { error: "Failed to list banners" },
      { status: 500 }
    );
  }
}

