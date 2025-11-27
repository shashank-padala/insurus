import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateSafetyChecklist } from "@/lib/ai/task-generation";
import { Database } from "@/types/database";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

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
    const { propertyId, month } = body;

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

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

    // Type assertion for property to ensure TypeScript recognizes the type
    type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
    const typedProperty = property as PropertyRow;

    // Fetch previous checklists for context
    const { data: previousChecklists } = await supabase
      .from("task_checklists")
      .select("*")
      .eq("property_id", propertyId)
      .order("checklist_month", { ascending: false })
      .limit(3);

    // Generate checklist month
    const checklistMonth = month
      ? new Date(month)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const dueDate = new Date(
      checklistMonth.getFullYear(),
      checklistMonth.getMonth() + 1,
      0
    ); // Last day of month

    // Generate tasks using AI
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
      previousChecklists || []
    );

    // Get risk and task category IDs
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

    // Create checklist
    const { data: checklist, error: checklistError } = await (supabase
      .from("task_checklists") as any)
      .insert({
        property_id: propertyId,
        checklist_month: checklistMonth.toISOString().split("T")[0],
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
        },
      })
      .select()
      .single();

    if (checklistError) throw checklistError;

    // Create tasks from generated tasks
    const tasksToInsert = generatedTasks.map((task) => {
      const riskCategoryId = riskCategoryMap.get(task.riskCategory);
      const taskCategoryId = taskCategoryMap.get(task.category);

      if (!riskCategoryId || !taskCategoryId) {
        throw new Error(
          `Invalid category: ${task.category} or ${task.riskCategory}`
        );
      }

      // Calculate due date based on frequency
      let taskDueDate = new Date(checklistMonth);
      if (task.frequency === "monthly") {
        taskDueDate = new Date(
          checklistMonth.getFullYear(),
          checklistMonth.getMonth(),
          15
        ); // Mid-month
      } else if (task.frequency === "quarterly") {
        taskDueDate = new Date(
          checklistMonth.getFullYear(),
          checklistMonth.getMonth() + 2,
          0
        ); // End of quarter
      } else if (task.frequency === "annually") {
        taskDueDate = new Date(
          checklistMonth.getFullYear(),
          11,
          31
        ); // End of year
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

    const { data: tasks, error: tasksError } = await (supabase
      .from("tasks") as any)
      .insert(tasksToInsert)
      .select();

    if (tasksError) throw tasksError;

    return NextResponse.json({
      checklist,
      tasks,
      generatedCount: generatedTasks.length,
    });
  } catch (error: any) {
    console.error("Error generating checklist:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate checklist" },
      { status: 500 }
    );
  }
}

