import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { verifyTaskPhoto } from "@/lib/ai/photo-verification";

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
    const { taskId, imageUrl, receiptUrl } = body;

    if (!taskId || (!imageUrl && !receiptUrl)) {
      return NextResponse.json(
        { error: "Task ID and image/receipt URL are required" },
        { status: 400 }
      );
    }

    // Fetch task details
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select(`
        *,
        task_checklists!inner(
          properties!inner(user_id)
        )
      `)
      .eq("id", taskId)
      .eq("task_checklists.properties.user_id", user.id)
      .single();

    if (taskError || !task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Verify the photo using AI
    const verificationUrl = imageUrl || receiptUrl;
    const result = await verifyTaskPhoto(
      verificationUrl,
      task.task_name,
      task.description,
      task.verification_type,
      [] // Could fetch from template if needed
    );

    // Create verification record
    const { data: verification, error: verificationError } = await supabase
      .from("verifications")
      .insert({
        task_id: taskId,
        photo_url: imageUrl || null,
        receipt_url: receiptUrl || null,
        ai_analysis: result,
        is_verified: result.isVerified,
        verification_confidence: result.confidence,
        rejection_reason: result.rejectionReason || null,
        verification_type: task.verification_type,
      })
      .select()
      .single();

    if (verificationError) throw verificationError;

    // Update task status
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        status: result.isVerified ? "verified" : "rejected",
        verification_result: result,
        verified_at: result.isVerified ? new Date().toISOString() : null,
        photo_url: imageUrl || task.photo_url,
        receipt_url: receiptUrl || task.receipt_url,
      })
      .eq("id", taskId);

    if (updateError) throw updateError;

    return NextResponse.json({
      verification,
      result,
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify task" },
      { status: 500 }
    );
  }
}

