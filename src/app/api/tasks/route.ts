import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // all, pending, in_progress, completed, overdue
    const propertyId = searchParams.get("propertyId");

    // Build base query - get all tasks for user's properties
    let query = supabase
      .from("tasks")
      .select(`
        *,
        task_checklists!inner(
          id,
          checklist_month,
          status,
          properties!inner(
            id,
            user_id,
            address,
            city,
            state,
            property_type
          )
        ),
        task_categories(name, code),
        risk_categories(name, code)
      `)
      .eq("task_checklists.properties.user_id", user.id)
      .order("due_date", { ascending: true });

    // Apply property filter if provided
    if (propertyId) {
      query = query.eq("task_checklists.property_id", propertyId);
    }

    const { data: tasks, error } = await query;

    if (error) throw error;

    // Apply status filters
    let filteredTasks = tasks || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "pending":
        filteredTasks = filteredTasks.filter(
          (t: any) => t.status === "pending" || t.status === null
        );
        break;
      case "in_progress":
        filteredTasks = filteredTasks.filter(
          (t: any) => t.status === "in_progress"
        );
        break;
      case "completed":
        filteredTasks = filteredTasks.filter(
          (t: any) => t.status === "verified" || t.status === "completed"
        );
        break;
      case "overdue":
        filteredTasks = filteredTasks.filter((t: any) => {
          if (!t.due_date) return false;
          const dueDate = new Date(t.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return (
            dueDate < today &&
            (t.status === "pending" ||
              t.status === null ||
              t.status === "in_progress")
          );
        });
        break;
      case "all":
      default:
        // No filtering
        break;
    }

    return NextResponse.json(filteredTasks);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

