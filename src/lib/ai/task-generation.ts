import OpenAI from "openai";
import { TASK_TEMPLATES, TaskCategory, RiskCategory } from "@/constants/task-strategy";
import { validateTask } from "@/constants/rewards-system";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PropertyDetails {
  address: string;
  city: string;
  state: string;
  country: string;
  propertyType: string;
  safetyDevices?: string[];
  riskAssessment?: any;
}

export interface GeneratedTask {
  template_id?: string;
  name: string;
  description: string;
  category: string;
  riskCategory: string;
  pointsValue: number;
  frequency: "monthly" | "quarterly" | "annually" | "as_needed";
  verificationType: "photo" | "receipt" | "document" | "both";
  insuranceRelevance: string;
  exampleEvidence: string[];
}

/**
 * Generate AI-powered safety checklist for a property
 * Uses GPT-4o to customize tasks based on property details
 */
export async function generateSafetyChecklist(
  property: PropertyDetails,
  previousChecklists?: any[]
): Promise<GeneratedTask[]> {
  // Get available task templates for reference
  const availableTemplates = TASK_TEMPLATES;

  // Build prompt for GPT-4o
  const prompt = buildTaskGenerationPrompt(property, availableTemplates, previousChecklists);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert in home safety and insurance risk assessment. Generate personalized safety tasks based on property details and USA home insurance industry standards. All tasks MUST have points assigned (1-10) and belong to valid categories.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(content);
    const tasks: GeneratedTask[] = parsed.tasks || [];

    // Validate all generated tasks
    const validatedTasks: GeneratedTask[] = [];
    for (const task of tasks) {
      const validation = validateTask({
        pointsValue: task.pointsValue,
        category: task.category,
        verificationType: task.verificationType,
        frequency: task.frequency,
      });

      if (validation.valid) {
        validatedTasks.push(task);
      } else {
        console.warn("Invalid task generated, skipping:", validation.errors, task);
      }
    }

    // If no valid tasks, fall back to default templates
    if (validatedTasks.length === 0) {
      console.warn("No valid tasks generated, using default templates");
      return getDefaultTasksForProperty(property);
    }

    return validatedTasks;
  } catch (error: any) {
    console.error("Error generating tasks:", error);
    // Fall back to default templates on error
    return getDefaultTasksForProperty(property);
  }
}

function buildTaskGenerationPrompt(
  property: PropertyDetails,
  templates: typeof TASK_TEMPLATES,
  previousChecklists?: any[]
): string {
  const templateExamples = templates.slice(0, 10).map((t) => ({
    name: t.name,
    category: t.category,
    pointsValue: t.pointsValue,
    frequency: t.frequency,
    verificationType: t.verificationType,
  }));

  let prompt = `Generate a comprehensive monthly safety checklist for the following property:

Property Details:
- Address: ${property.address}, ${property.city}, ${property.state}, ${property.country}
- Property Type: ${property.propertyType}
- Safety Devices: ${property.safetyDevices?.join(", ") || "None specified"}

Available Task Categories:
${Object.values(TaskCategory).join(", ")}

Available Risk Categories:
${Object.values(RiskCategory).join(", ")}

Example Task Templates (for reference):
${JSON.stringify(templateExamples, null, 2)}

Requirements:
1. Generate 8-12 tasks appropriate for this property
2. Each task MUST have:
   - name: Clear, actionable task name
   - description: Detailed description of what to do
   - category: One of the valid task categories (${Object.values(TaskCategory).join(", ")})
   - riskCategory: One of the valid risk categories (${Object.values(RiskCategory).join(", ")})
   - pointsValue: Integer between 1-10 based on insurance risk reduction importance
   - frequency: "monthly", "quarterly", "annually", or "as_needed"
   - verificationType: "photo", "receipt", "document", or "both"
   - insuranceRelevance: Brief explanation of how this affects insurance
   - exampleEvidence: Array of 2-3 example evidence submissions

3. Prioritize tasks based on:
   - Property location (consider local risks like hurricanes, earthquakes, wildfires)
   - Property type (house vs apartment)
   - Existing safety devices
   - Common insurance claims for this area

4. Reference existing templates when possible, but customize for this specific property

${previousChecklists && previousChecklists.length > 0
    ? `\nPrevious Checklist History:\n${JSON.stringify(previousChecklists.slice(0, 3), null, 2)}\nConsider avoiding recently completed tasks or adjusting based on past performance.`
    : ""
}

Return a JSON object with this structure:
{
  "tasks": [
    {
      "name": "Task Name",
      "description": "Detailed description",
      "category": "fire_safety",
      "riskCategory": "natural_risks",
      "pointsValue": 8,
      "frequency": "monthly",
      "verificationType": "photo",
      "insuranceRelevance": "Explanation",
      "exampleEvidence": ["Example 1", "Example 2"]
    }
  ]
}`;

  return prompt;
}

/**
 * Get default tasks for a property when AI generation fails
 * Returns a subset of templates appropriate for the property type
 */
function getDefaultTasksForProperty(property: PropertyDetails): GeneratedTask[] {
  // Return essential tasks that apply to all properties
  const essentialTasks = TASK_TEMPLATES.filter(
    (t) =>
      t.id === "fire_safety_001" || // Smoke Detector Test
      t.id === "water_004" || // Plumbing Leak Inspection
      t.id === "security_001" || // Deadbolt Lock Verification
      t.id === "equipment_001" // Carbon Monoxide Detector Test
  );

  return essentialTasks.map((t) => ({
    template_id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    riskCategory: t.riskCategory,
    pointsValue: t.pointsValue,
    frequency: t.frequency,
    verificationType: t.verificationType,
    insuranceRelevance: t.insuranceRelevance,
    exampleEvidence: t.examples,
  }));
}

