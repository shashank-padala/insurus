import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Database } from "@/types/database";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

/**
 * Generate checklists for all properties for a given year
 * This is a manual trigger endpoint that can be called in December to generate next year's checklists
 * Requires service role key or admin authentication
 */
export async function POST(request: Request) {
  try {
    // Verify this is an admin/service role request
    const authHeader = request.headers.get("authorization");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();
    const body = await request.json();
    const { year } = body;

    const targetYear = year || new Date().getFullYear() + 1; // Default to next year

    // Fetch all active properties
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select("id, user_id, address, city, state, country, property_type, safety_devices, risk_assessment");

    if (propertiesError || !properties) {
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      );
    }

    // Type the properties array
    const typedProperties = properties as PropertyRow[];

    const results = {
      year: targetYear,
      total_properties: properties.length,
      processed: 0,
      created: 0,
      skipped: 0,
      errors: [] as Array<{ property_id: string; error: string }>,
    };

    // Import the generate function
    const { generateSafetyChecklist } = await import("@/lib/ai/task-generation");

    // Process each property
    for (const property of typedProperties) {
      try {
        results.processed++;

        // Check which months already have checklists for this year
        const yearStart = `${targetYear}-01-01`;
        const yearEnd = `${targetYear}-12-31`;

        const { data: existingChecklists } = await supabase
          .from("task_checklists")
          .select("checklist_month")
          .eq("property_id", property.id)
          .gte("checklist_month", yearStart)
          .lte("checklist_month", yearEnd);

        // Type the result properly
        type ChecklistMonth = { checklist_month: string };
        const typedChecklists = (existingChecklists || []) as ChecklistMonth[];
        const existingMonths = new Set(
          typedChecklists.map((c) => c.checklist_month)
        );

        let createdCount = 0;

        // Generate checklists for all 12 months
        for (let month = 0; month < 12; month++) {
          const checklistMonth = new Date(targetYear, month, 1);
          const monthStr = checklistMonth.toISOString().split("T")[0];

          // Skip if checklist already exists
          if (existingMonths.has(monthStr)) {
            continue;
          }

          const dueDate = new Date(targetYear, month + 1, 0);

          // Generate tasks using AI
          const generatedTasks = await generateSafetyChecklist(
            {
              address: property.address,
              city: property.city,
              state: property.state,
              country: property.country,
              propertyType: property.property_type,
              safetyDevices: property.safety_devices as string[],
              riskAssessment: property.risk_assessment,
            },
            []
          );

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

          // Create checklist - use type assertion on result
          type ChecklistInsert = Database["public"]["Tables"]["task_checklists"]["Insert"];
          const checklistInsert: ChecklistInsert = {
            property_id: property.id,
            checklist_month: monthStr,
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
              year: targetYear,
            } as any,
          };
          
          // Use type assertion on the entire query to work around type inference issues
          const insertResult = await (supabase
            .from("task_checklists") as any)
            .insert(checklistInsert)
            .select()
            .single();
          
          const { data: checklistData, error: checklistError } = insertResult;

          if (checklistError || !checklistData) throw checklistError || new Error("Failed to create checklist");
          
          type ChecklistRow = Database["public"]["Tables"]["task_checklists"]["Row"];
          const checklist = checklistData as ChecklistRow;

          // Create tasks
          const tasksToInsert = generatedTasks.map((task) => {
            const riskCategoryId = riskCategoryMap.get(task.riskCategory);
            const taskCategoryId = taskCategoryMap.get(task.category);

            if (!riskCategoryId || !taskCategoryId) {
              throw new Error(
                `Invalid category: ${task.category} or ${task.riskCategory}`
              );
            }

            let taskDueDate = new Date(checklistMonth);
            if (task.frequency === "monthly") {
              taskDueDate = new Date(targetYear, month, 15);
            } else if (task.frequency === "quarterly") {
              taskDueDate = new Date(targetYear, month + 2, 0);
            } else if (task.frequency === "annually") {
              taskDueDate = new Date(targetYear, 11, 31);
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
            };
          });

          // Type the tasks insert
          const typedTasksToInsert: TaskInsert[] = tasksToInsert.map(t => t as TaskInsert);
          
          // Use type assertion to work around type inference issues
          const tasksInsertResult = await (supabase
            .from("tasks") as any)
            .insert(typedTasksToInsert);
          
          const { error: tasksError } = tasksInsertResult;

          if (tasksError) throw tasksError;

          createdCount++;
        }

        results.created += createdCount;
        if (createdCount === 0) {
          results.skipped++;
        }
      } catch (error: any) {
        results.errors.push({
          property_id: property.id,
          error: error.message || "Failed to process",
        });
      }
    }

    return NextResponse.json({
      message: `Yearly checklist generation completed for ${targetYear}`,
      ...results,
    });
  } catch (error: any) {
    console.error("Error generating checklists for all properties:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate checklists" },
      { status: 500 }
    );
  }
}

