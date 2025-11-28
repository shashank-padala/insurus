import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "../auth/route";

// GET: Fetch task and risk categories (admin only)
export async function GET() {
  try {
    // Verify admin session
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();

    const [taskCategoriesResult, riskCategoriesResult] = await Promise.all([
      supabase
        .from("task_categories")
        .select("id, name, code")
        .eq("is_active", true)
        .order("name"),
      supabase
        .from("risk_categories")
        .select("id, name, code")
        .eq("is_active", true)
        .order("name"),
    ]);

    if (taskCategoriesResult.error) throw taskCategoriesResult.error;
    if (riskCategoriesResult.error) throw riskCategoriesResult.error;

    return NextResponse.json({
      taskCategories: taskCategoriesResult.data || [],
      riskCategories: riskCategoriesResult.data || [],
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

