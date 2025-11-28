import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  rejectionReason?: string;
  analysis: string;
}

/**
 * Verify task completion photo using GPT-4 Vision
 */
export async function verifyTaskPhoto(
  imageUrl: string,
  taskName: string,
  taskDescription: string,
  verificationType: "photo" | "receipt" | "document" | "both",
  expectedEvidence?: string[]
): Promise<VerificationResult> {
  try {
    // Download image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to download image");
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const imageMimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    // Build prompt based on verification type
    const prompt = buildVerificationPrompt(
      taskName,
      taskDescription,
      verificationType,
      expectedEvidence
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a strict home safety task verification expert. Your job is to verify if uploaded images are directly related to the assigned task. You must REJECT any image that is not clearly related to the task description. Be very strict - only verify images that clearly show evidence of the specific task being completed. If an image is unrelated, generic, or doesn't match the task, you must reject it with a clear message asking for a relevant image.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageMimeType};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "";
    const parsed = parseVerificationResponse(content, taskName);

    // Ensure minimum confidence threshold for verification
    if (parsed.isVerified && parsed.confidence < 0.7) {
      return {
        isVerified: false,
        confidence: parsed.confidence,
        rejectionReason: `Please upload a relevant image related to ${taskName}. The current image does not meet the confidence threshold.`,
        analysis: parsed.analysis,
      };
    }

    return parsed;
  } catch (error: any) {
    console.error("Verification error:", error);
    return {
      isVerified: false,
      confidence: 0,
      rejectionReason: error.message || "Verification failed",
      analysis: "Unable to analyze image",
    };
  }
}

function buildVerificationPrompt(
  taskName: string,
  taskDescription: string,
  verificationType: string,
  expectedEvidence?: string[]
): string {
  let prompt = `You are a strict home safety task verification system. Analyze this image carefully to determine if it shows valid evidence that the following safety task has been completed.

CRITICAL: The image MUST be directly related to the task. If the image shows something unrelated, random, or irrelevant to the task, you MUST reject it.

Task: ${taskName}
Description: ${taskDescription}
Verification Type: ${verificationType}

${expectedEvidence && expectedEvidence.length > 0
    ? `Expected Evidence Examples:\n${expectedEvidence.map((e) => `- ${e}`).join("\n")}`
    : ""
}

VERIFICATION RULES:
1. The image MUST clearly show evidence related to the task description
2. If the image is unrelated, generic, or doesn't match the task, REJECT it
3. If you cannot determine relevance, REJECT it
4. Only verify if you are confident (confidence > 0.7) that the image shows task completion
5. Be strict - it's better to reject an unclear image than to accept irrelevant content

Please analyze the image and determine:
1. Is the image directly related to this specific task? (If NO, reject immediately)
2. Does the image show valid evidence that this task was completed?
3. What is your confidence level (0.0 to 1.0)? (Must be > 0.7 to verify)
4. If not verified, provide a clear reason (e.g., "Image is not related to the task", "Please upload a relevant image related to [task name]")

Return your response in this JSON format:
{
  "isVerified": true/false,
  "confidence": 0.0-1.0,
  "rejectionReason": "reason if not verified (e.g., 'Please upload a relevant image related to [task name]'), null if verified",
  "analysis": "brief explanation of your analysis"
}`;

  if (verificationType === "receipt") {
    prompt += `\n\nNote: This task requires a receipt from a professional service. Look for:\n- Service provider name\n- Date of service\n- Description of work performed\n- Professional credentials or license numbers\n\nIf the receipt doesn't match the task description, REJECT it.`;
  } else if (verificationType === "both") {
    prompt += `\n\nNote: This task can be verified with either a photo OR a receipt. Accept either form of evidence, but ensure it's relevant to the task.`;
  } else {
    // Photo verification
    prompt += `\n\nNote: This task requires a photo. The photo must clearly show evidence related to "${taskName}". If the photo shows something unrelated, REJECT it with the message: "Please upload a relevant image related to ${taskName}".`;
  }

  return prompt;
}

function parseVerificationResponse(content: string, taskName: string): VerificationResult {
  try {
    // Try to extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        isVerified: parsed.isVerified === true,
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0)),
        rejectionReason: parsed.rejectionReason || undefined,
        analysis: parsed.analysis || content,
      };
    }

    // Fallback: try to infer from text
    const lowerContent = content.toLowerCase();
    const isVerified = lowerContent.includes("verified") || lowerContent.includes("confirmed");
    const confidence = isVerified ? 0.8 : 0.2;

    return {
      isVerified,
      confidence,
      rejectionReason: isVerified ? undefined : "Could not verify from image",
      analysis: content,
    };
  } catch (error) {
    // Default to rejection if parsing fails
    // Default rejection with helpful message
    return {
      isVerified: false,
      confidence: 0,
      rejectionReason: `Please upload a relevant image related to ${taskName}`,
      analysis: content,
    };
  }
}

