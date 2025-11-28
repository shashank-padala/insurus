import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateSafetyChecklist } from "@/lib/ai/task-generation";
import { Database } from "@/types/database";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

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
    const { address, city, state, country, propertyType, safetyDevices } = body;

    if (!address || !city || !state || !propertyType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: property, error } = await (supabase
      .from("properties") as any)
      .insert({
        user_id: user.id,
        address,
        city,
        state,
        country: country || "USA",
        property_type: propertyType,
        safety_devices: safetyDevices || [],
      })
      .select()
      .single();

    if (error) throw error;

    // Automatically generate tasks for 1 year from property registration
    try {
      const typedProperty = property as PropertyRow;
      const propertyCreatedAt = new Date(property.created_at);
      
      // First task due date = property registration + 30 days minimum
      const firstTaskDate = new Date(propertyCreatedAt);
      firstTaskDate.setDate(firstTaskDate.getDate() + 30);
      
      // Generate tasks using AI (this generates task templates)
      const generatedTaskTemplates = await generateSafetyChecklist(
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

      // Generate tasks for 1 year based on frequency
      const allTasksToInsert: any[] = [];
      const oneYearLater = new Date(propertyCreatedAt);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      for (const taskTemplate of generatedTaskTemplates) {
        const riskCategoryId = riskCategoryMap.get(taskTemplate.riskCategory);
        const taskCategoryId = taskCategoryMap.get(taskTemplate.category);

        if (!riskCategoryId || !taskCategoryId) {
          console.warn(
            `Invalid category: ${taskTemplate.category} or ${taskTemplate.riskCategory}`
          );
          continue;
        }

        // Generate task instances based on frequency
        if (taskTemplate.frequency === "monthly") {
          // Generate 12 monthly tasks
          for (let month = 0; month < 12; month++) {
            const taskDate = new Date(firstTaskDate);
            taskDate.setMonth(taskDate.getMonth() + month);
            
            // Skip if task date is beyond 1 year
            if (taskDate > oneYearLater) break;
            
            // Create checklist for this month if it doesn't exist
            const checklistMonth = new Date(taskDate.getFullYear(), taskDate.getMonth(), 1);
            const checklistMonthStr = checklistMonth.toISOString().split("T")[0];
            
            const { data: existingChecklist } = await supabase
              .from("task_checklists")
              .select("id")
              .eq("property_id", property.id)
              .eq("checklist_month", checklistMonthStr)
              .maybeSingle();
            
            let checklist = existingChecklist;
            
            if (!checklist) {
              const dueDate = new Date(checklistMonth.getFullYear(), checklistMonth.getMonth() + 1, 0);
              const { data: newChecklist } = await (supabase
                .from("task_checklists") as any)
                .insert({
                  property_id: property.id,
                  checklist_month: checklistMonthStr,
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
              
              if (newChecklist) {
                checklist = newChecklist;
              }
            }
            
            if (checklist) {
              allTasksToInsert.push({
                checklist_id: checklist.id,
                template_id: taskTemplate.template_id || null,
                task_name: taskTemplate.name,
                description: taskTemplate.description,
                task_category_id: taskCategoryId,
                risk_category_id: riskCategoryId,
                base_points_value: taskTemplate.pointsValue,
                frequency: taskTemplate.frequency,
                verification_type: taskTemplate.verificationType,
                status: "pending",
                due_date: taskDate.toISOString().split("T")[0],
              });
            }
          }
        } else if (taskTemplate.frequency === "quarterly") {
          // Generate 4 quarterly tasks
          for (let quarter = 0; quarter < 4; quarter++) {
            const taskDate = new Date(firstTaskDate);
            taskDate.setMonth(taskDate.getMonth() + (quarter * 3));
            
            // Skip if task date is beyond 1 year
            if (taskDate > oneYearLater) break;
            
            // Create checklist for this quarter
            const checklistMonth = new Date(taskDate.getFullYear(), taskDate.getMonth(), 1);
            const checklistMonthStr = checklistMonth.toISOString().split("T")[0];
            
            const { data: existingChecklist } = await supabase
              .from("task_checklists")
              .select("id")
              .eq("property_id", property.id)
              .eq("checklist_month", checklistMonthStr)
              .maybeSingle();
            
            let checklist = existingChecklist;
            
            if (!checklist) {
              const dueDate = new Date(checklistMonth.getFullYear(), checklistMonth.getMonth() + 1, 0);
              const { data: newChecklist } = await (supabase
                .from("task_checklists") as any)
                .insert({
                  property_id: property.id,
                  checklist_month: checklistMonthStr,
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
              
              if (newChecklist) {
                checklist = newChecklist;
              }
            }
            
            if (checklist) {
              allTasksToInsert.push({
                checklist_id: checklist.id,
                template_id: taskTemplate.template_id || null,
                task_name: taskTemplate.name,
                description: taskTemplate.description,
                task_category_id: taskCategoryId,
                risk_category_id: riskCategoryId,
                base_points_value: taskTemplate.pointsValue,
                frequency: taskTemplate.frequency,
                verification_type: taskTemplate.verificationType,
                status: "pending",
                due_date: taskDate.toISOString().split("T")[0],
              });
            }
          }
        } else if (taskTemplate.frequency === "annually") {
          // Generate 1 annual task (first year)
          const taskDate = new Date(firstTaskDate);
          taskDate.setFullYear(taskDate.getFullYear() + 1);
          
          // Only create if within 1 year window
          if (taskDate <= oneYearLater) {
            const checklistMonth = new Date(taskDate.getFullYear(), taskDate.getMonth(), 1);
            const checklistMonthStr = checklistMonth.toISOString().split("T")[0];
            
            const { data: existingChecklist } = await supabase
              .from("task_checklists")
              .select("id")
              .eq("property_id", property.id)
              .eq("checklist_month", checklistMonthStr)
              .maybeSingle();
            
            let checklist = existingChecklist;
            
            if (!checklist) {
              const dueDate = new Date(checklistMonth.getFullYear(), checklistMonth.getMonth() + 1, 0);
              const { data: newChecklist } = await (supabase
                .from("task_checklists") as any)
                .insert({
                  property_id: property.id,
                  checklist_month: checklistMonthStr,
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
              
              if (newChecklist) {
                checklist = newChecklist;
              }
            }
            
            if (checklist) {
              allTasksToInsert.push({
                checklist_id: checklist.id,
                template_id: taskTemplate.template_id || null,
                task_name: taskTemplate.name,
                description: taskTemplate.description,
                task_category_id: taskCategoryId,
                risk_category_id: riskCategoryId,
                base_points_value: taskTemplate.pointsValue,
                frequency: taskTemplate.frequency,
                verification_type: taskTemplate.verificationType,
                status: "pending",
                due_date: taskDate.toISOString().split("T")[0],
              });
            }
          }
        }
      }

      // Insert all tasks in batches
      if (allTasksToInsert.length > 0) {
        const batchSize = 100;
        for (let i = 0; i < allTasksToInsert.length; i += batchSize) {
          const batch = allTasksToInsert.slice(i, i + batchSize);
          const { error: tasksError } = await (supabase
            .from("tasks") as any)
            .insert(batch);

          if (tasksError) {
            console.error("Failed to create tasks batch:", tasksError);
          }
        }
      }
    } catch (checklistError: any) {
      console.error("Error generating checklist:", checklistError);
      // Continue even if checklist generation fails - property is still created
    }

    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create property" },
      { status: 500 }
    );
  }
}

