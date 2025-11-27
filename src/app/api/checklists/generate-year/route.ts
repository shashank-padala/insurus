import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateSafetyChecklist } from "@/lib/ai/task-generation";
import { Database } from "@/types/database";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type ChecklistInsert = Database["public"]["Tables"]["task_checklists"]["Insert"];
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

/**
 * Generate checklists for an entire year for a property
 * This endpoint can be called manually to create all monthly checklists for a given year
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId, year } = body;

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const targetYear = year || new Date().getFullYear();

    // Fetch property details
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .eq("user_id", user.id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const typedProperty = property as PropertyRow;

    // Check which months already have checklists for this year
    const yearStart = `${targetYear}-01-01`;
    const yearEnd = `${targetYear}-12-31`;

    const { data: existingChecklists } = await supabase
      .from("task_checklists")
      .select("checklist_month")
      .eq("property_id", propertyId)
      .gte("checklist_month", yearStart)
      .lte("checklist_month", yearEnd);

    // Type the result explicitly
    type ChecklistMonthResult = { checklist_month: string };
    const typedChecklists = (existingChecklists || []) as ChecklistMonthResult[];
    const existingMonths = new Set(
      typedChecklists.map((c) => c.checklist_month)
    );

    // Generate checklists for all 12 months
    const createdChecklists = [];
    const errors = [];

    for (let month = 0; month < 12; month++) {
      try {
        const checklistMonth = new Date(targetYear, month, 1);
        const monthStr = checklistMonth.toISOString().split("T")[0];

        // Skip if checklist already exists
        if (existingMonths.has(monthStr)) {
          continue;
        }

        // Calculate due date (last day of the month)
        const dueDate = new Date(targetYear, month + 1, 0);

        // Generate tasks using AI for this month
        // Tasks can vary by month/season, but for now we generate standard tasks
        const generatedTasks = await generateSafetyChecklist(
          {
            address: typedProperty.address,
            city: typedProperty.city,
            state: typedProperty.state,
            country: typedProperty.country,
            propertyType: typedProperty.property_type,
            safetyDevices: typedProperty.safety_devices as string[],
            riskAssessment: typedProperty.risk_assessment,
          },
          []
        );

        // Create checklist - use type assertion to work around type inference issues
        const checklistData: ChecklistInsert = {
          property_id: propertyId,
          checklist_month: monthStr,
          status: "pending",
          due_date: dueDate.toISOString().split("T")[0],
          ai_generation_metadata: {
            generated_at: new Date().toISOString(),
            property_details: {
              address: typedProperty.address,
              city: typedProperty.city,
              state: typedProperty.state,
              property_type: typedProperty.property_type,
            },
            year: targetYear,
          } as any, // JSONB can be any shape
        };
        
        const insertResult = await (supabase
          .from("task_checklists") as any)
          .insert(checklistData)
          .select()
          .single();
        
        const { data: checklist, error: checklistError } = insertResult;

        if (checklistError) throw checklistError;

        // Get category IDs
        const { data: riskCategories } = await supabase
          .from("risk_categories")
          .select("id, code");
        const { data: taskCategories } = await supabase
          .from("task_categories")
          .select("id, code");

        // Type the category results
        type CategoryRow = { id: string; code: string };
        const typedRiskCategories = (riskCategories || []) as CategoryRow[];
        const typedTaskCategories = (taskCategories || []) as CategoryRow[];
        
        const riskCategoryMap = new Map(
          typedRiskCategories.map((rc) => [rc.code, rc.id])
        );
        const taskCategoryMap = new Map(
          typedTaskCategories.map((tc) => [tc.code, tc.id])
        );

        // Create tasks for this checklist
        const tasksToInsert: TaskInsert[] = generatedTasks.map((task) => {
          const riskCategoryId = riskCategoryMap.get(task.riskCategory);
          const taskCategoryId = taskCategoryMap.get(task.category);

          if (!riskCategoryId || !taskCategoryId) {
            throw new Error(
              `Invalid category: ${task.category} or ${task.riskCategory}`
            );
          }

          // Calculate task due date based on frequency
          let taskDueDate = new Date(checklistMonth);
          if (task.frequency === "monthly") {
            taskDueDate = new Date(targetYear, month, 15); // Mid-month
          } else if (task.frequency === "quarterly") {
            taskDueDate = new Date(targetYear, month + 2, 0); // End of quarter
          } else if (task.frequency === "annually") {
            taskDueDate = new Date(targetYear, 11, 31); // End of year
          }

          return {
            checklist_id: checklist.id,
            template_id: task.template_id || null,
            task_name: task.name,
            description: task.description,
            task_category_id: taskCategoryId,
            risk_category_id: riskCategoryId,
            base_points_value: task.pointsValue,
            frequency: task.frequency,
            verification_type: task.verificationType,
            status: "pending",
            due_date: taskDueDate.toISOString().split("T")[0],
          } as TaskInsert;
        });

        // Use type assertion to work around type inference issues
        const tasksInsertResult = await (supabase
          .from("tasks") as any)
          .insert(tasksToInsert);
        
        const { error: tasksError } = tasksInsertResult;

        if (tasksError) throw tasksError;

        createdChecklists.push({
          month: monthStr,
          checklist_id: checklist.id,
          tasks_count: tasksToInsert.length,
        });
      } catch (error: any) {
        errors.push({
          month: new Date(targetYear, month, 1).toISOString().split("T")[0],
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      message: `Generated checklists for year ${targetYear}`,
      year: targetYear,
      property_id: propertyId,
      created: createdChecklists.length,
      checklists: createdChecklists,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error generating year checklists:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate year checklists" },
      { status: 500 }
    );
  }
}

