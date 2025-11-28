import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "../auth/route";
import { Database } from "@/types/database";

type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
type ChecklistInsert = Database["public"]["Tables"]["task_checklists"]["Insert"];

// POST: Create admin task and push to all users
export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      task_name,
      description,
      task_category_id,
      risk_category_id,
      base_points_value,
      verification_type,
      deadline,
    } = await request.json();

    // Validate required fields
    if (
      !task_name ||
      !description ||
      !task_category_id ||
      !risk_category_id ||
      !base_points_value ||
      !verification_type ||
      !deadline
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate verification_type
    if (!["photo", "receipt", "document", "both"].includes(verification_type)) {
      return NextResponse.json(
        { error: "Invalid verification_type" },
        { status: 400 }
      );
    }

    // Validate base_points_value
    if (base_points_value < 1 || base_points_value > 10) {
      return NextResponse.json(
        { error: "base_points_value must be between 1 and 10" },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Verify category IDs exist
    const [taskCategoryCheck, riskCategoryCheck] = await Promise.all([
      supabase
        .from("task_categories")
        .select("id")
        .eq("id", task_category_id)
        .single(),
      supabase
        .from("risk_categories")
        .select("id")
        .eq("id", risk_category_id)
        .single(),
    ]);

    if (taskCategoryCheck.error || !taskCategoryCheck.data) {
      return NextResponse.json(
        { error: "Invalid task_category_id" },
        { status: 400 }
      );
    }

    if (riskCategoryCheck.error || !riskCategoryCheck.data) {
      return NextResponse.json(
        { error: "Invalid risk_category_id" },
        { status: 400 }
      );
    }

    // Create admin_task record
    const { data: adminTask, error: adminTaskError } = await supabase
      .from("admin_tasks")
      .insert({
        task_name,
        description,
        task_category_id,
        risk_category_id,
        base_points_value,
        verification_type,
        deadline,
        is_active: true,
      })
      .select()
      .single();

    if (adminTaskError) throw adminTaskError;

    // Get all active users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id");

    if (usersError) throw usersError;

    if (!users || users.length === 0) {
      return NextResponse.json({
        adminTask,
        tasksCreated: 0,
        message: "No users found",
      });
    }

    // Get current month for checklist
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const checklistMonthStr = currentMonth.toISOString().split("T")[0];

    let tasksCreated = 0;
    const errors: string[] = [];

    // Process each user
    for (const user of users) {
      try {
        // Get user's properties
        const { data: properties, error: propertiesError } = await supabase
          .from("properties")
          .select("id, address, city, state, country, property_type")
          .eq("user_id", user.id);

        if (propertiesError) {
          errors.push(`User ${user.id}: ${propertiesError.message}`);
          continue;
        }

        if (!properties || properties.length === 0) {
          // Skip users without properties
          continue;
        }

        // For each property, create or get checklist and add task
        for (const property of properties) {
          try {
            // Find or create checklist for current month
            const { data: existingChecklist } = await supabase
              .from("task_checklists")
              .select("id")
              .eq("property_id", property.id)
              .eq("checklist_month", checklistMonthStr)
              .maybeSingle();

            let checklistId: string;

            if (existingChecklist) {
              checklistId = existingChecklist.id;
            } else {
              // Create new checklist
              const dueDate = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                0
              );

              const checklistInsert: ChecklistInsert = {
                property_id: property.id,
                checklist_month: checklistMonthStr,
                status: "pending",
                due_date: dueDate.toISOString().split("T")[0],
                ai_generation_metadata: {
                  generated_at: new Date().toISOString(),
                  property_details: {
                    address: property.address,
                    city: property.city,
                    state: property.state,
                    property_type: property.property_type,
                  },
                } as any,
              };

              const { data: newChecklist, error: checklistError } = await (
                supabase.from("task_checklists") as any
              )
                .insert(checklistInsert)
                .select()
                .single();

              if (checklistError || !newChecklist) {
                errors.push(
                  `Property ${property.id}: Failed to create checklist - ${checklistError?.message}`
                );
                continue;
              }

              checklistId = newChecklist.id;
            }

            // Create task
            const taskInsert: TaskInsert = {
              checklist_id: checklistId,
              template_id: null,
              task_name,
              description,
              task_category_id,
              risk_category_id,
              base_points_value,
              frequency: "as_needed", // Admin tasks are typically one-time
              verification_type,
              status: "pending",
              due_date: deadline,
            };

            const { data: task, error: taskError } = await (
              supabase.from("tasks") as any
            )
              .insert(taskInsert)
              .select()
              .single();

            if (taskError || !task) {
              errors.push(
                `Property ${property.id}: Failed to create task - ${taskError?.message}`
              );
              continue;
            }

            // Create user_admin_tasks junction record
            const { error: junctionError } = await supabase
              .from("user_admin_tasks")
              .insert({
                admin_task_id: adminTask.id,
                user_id: user.id,
                task_id: task.id,
                status: "pending",
              });

            if (junctionError) {
              errors.push(
                `User ${user.id}, Task ${task.id}: Failed to create junction - ${junctionError.message}`
              );
              // Continue even if junction fails - task is still created
            }

            tasksCreated++;
          } catch (error: any) {
            errors.push(
              `Property ${property.id}: ${error.message || "Unknown error"}`
            );
          }
        }
      } catch (error: any) {
        errors.push(`User ${user.id}: ${error.message || "Unknown error"}`);
      }
    }

    return NextResponse.json({
      adminTask,
      tasksCreated,
      errors: errors.length > 0 ? errors : undefined,
      message: `Created ${tasksCreated} tasks for ${users.length} users`,
    });
  } catch (error: any) {
    console.error("Error creating admin task:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create admin task" },
      { status: 500 }
    );
  }
}

// GET: List all admin tasks (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("admin_tasks")
      .select(`
        *,
        task_categories(name, code),
        risk_categories(name, code)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Error listing admin tasks:", error);
    return NextResponse.json(
      { error: "Failed to list admin tasks" },
      { status: 500 }
    );
  }
}

