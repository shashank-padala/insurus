import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ checklistId: string }> }
) {
  try {
    const { checklistId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify checklist belongs to user
    const { data: checklist } = await supabase
      .from("task_checklists")
      .select(`
        id,
        properties!inner(user_id)
      `)
      .eq("id", checklistId)
      .eq("properties.user_id", user.id)
      .single();

    if (!checklist) {
      return NextResponse.json(
        { error: "Checklist not found" },
        { status: 404 }
      );
    }

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        *,
        task_categories(name, code),
        risk_categories(name, code)
      `)
      .eq("checklist_id", checklistId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

