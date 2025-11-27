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
            "You are an expert in verifying home safety task completion. Analyze photos carefully and determine if they show valid evidence of task completion. Be strict but fair - only verify if the evidence clearly shows the task was completed correctly.",
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
    const parsed = parseVerificationResponse(content);

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
  let prompt = `Analyze this image to verify if the following safety task has been completed:

Task: ${taskName}
Description: ${taskDescription}
Verification Type: ${verificationType}

${expectedEvidence && expectedEvidence.length > 0
    ? `Expected Evidence Examples:\n${expectedEvidence.map((e) => `- ${e}`).join("\n")}`
    : ""
}

Please analyze the image and determine:
1. Does the image show valid evidence that this task was completed?
2. What is your confidence level (0.0 to 1.0)?
3. If not verified, what is the reason?

Return your response in this JSON format:
{
  "isVerified": true/false,
  "confidence": 0.0-1.0,
  "rejectionReason": "reason if not verified, null if verified",
  "analysis": "brief explanation of your analysis"
}`;

  if (verificationType === "receipt") {
    prompt += `\n\nNote: This task requires a receipt from a professional service. Look for:\n- Service provider name\n- Date of service\n- Description of work performed\n- Professional credentials or license numbers`;
  } else if (verificationType === "both") {
    prompt += `\n\nNote: This task can be verified with either a photo OR a receipt. Accept either form of evidence.`;
  }

  return prompt;
}

function parseVerificationResponse(content: string): VerificationResult {
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
    return {
      isVerified: false,
      confidence: 0,
      rejectionReason: "Unable to parse verification response",
      analysis: content,
    };
  }
}

