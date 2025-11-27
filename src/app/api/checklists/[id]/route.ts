import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Database } from "@/types/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: checklist, error: checklistError } = await supabase
      .from("task_checklists")
      .select(`
        *,
        properties!inner(user_id)
      `)
      .eq("id", id)
      .eq("properties.user_id", user.id)
      .single();

    if (checklistError) throw checklistError;

    // Fetch tasks for this checklist
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select(`
        *,
        task_categories(name, code),
        risk_categories(name, code)
      `)
      .eq("checklist_id", id)
      .order("created_at", { ascending: true });

    if (tasksError) throw tasksError;

    // Type the checklist result
    type ChecklistRow = Database["public"]["Tables"]["task_checklists"]["Row"];
    const typedChecklist = checklist as ChecklistRow;
    
    return NextResponse.json({
      ...typedChecklist,
      tasks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch checklist" },
      { status: 500 }
    );
  }
}

