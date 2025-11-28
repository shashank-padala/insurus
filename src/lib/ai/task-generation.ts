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
          content: `You are an expert in home safety and insurance risk assessment. Generate ONLY tasks that USA home insurance providers care about. Base points (1-10) are the final points awarded - no multipliers. Fire safety and equipment checks should be quarterly, not monthly. Keep tasks simple and practical for homeowners.`,
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

  let prompt = `You are generating safety tasks for a USA homeowner. Think like a homeowner - what simple tasks prevent insurance claims? Generate ONLY tasks that USA home insurance providers actually care about.

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

CRITICAL REQUIREMENTS:
1. Generate 10-15 tasks appropriate for this property
2. Frequency Distribution:
   - Monthly tasks (30%): Only simple visual checks like security system tests, sump pump tests, plumbing leak checks
   - Quarterly tasks (50%): Fire safety checks (smoke detectors, fire extinguishers), equipment verification (CO detectors, generators), water damage prevention (gutter cleaning, foundation inspection)
   - Annual tasks (20%): Professional services (HVAC service, electrical inspection, roof inspection, fire alarm system inspection)
   - IMPORTANT: Fire safety and equipment verification tasks should be QUARTERLY, not monthly

3. Points System:
   - Base points (1-10) are the FINAL points awarded - no multipliers or bonuses
   - Higher points (8-10) for critical safety tasks (smoke detectors, CO detectors, electrical)
   - Medium points (5-7) for important prevention (water damage, security)
   - Lower points (3-4) for routine maintenance

4. Each task MUST have:
   - name: Clear, actionable task name
   - description: Detailed description of what to do
   - category: One of the valid task categories
   - riskCategory: One of the valid risk categories
   - pointsValue: Integer between 1-10 (this is the final points awarded)
   - frequency: "monthly", "quarterly", "annually", or "as_needed"
   - verificationType: "photo", "receipt", "document", or "both"
   - insuranceRelevance: Brief explanation of how this prevents insurance claims
   - exampleEvidence: Array of 2-3 example evidence submissions

5. Focus on tasks that prevent common insurance claims:
   - Fire damage (smoke detectors, fire extinguishers, electrical safety)
   - Water damage (plumbing, sump pumps, gutters)
   - Theft (security systems, locks)
   - Wind/storm damage (roof, windows, trees)
   - Liability (maintenance, safety equipment)

6. Keep it simple and practical - homeowners need tasks they can actually complete

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
      "frequency": "quarterly",
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

