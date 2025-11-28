import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { verifyTaskPhoto } from "@/lib/ai/photo-verification";
import {
  calculatePointsForTask,
  calculateSafetyScorePercentage,
} from "@/lib/rewards/points-calculation";
import { getCurrentTier } from "@/constants/rewards-system";
import { publishTaskCompletion, hashFile } from "@/lib/blockchain/vechain";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { photoUrl, receiptUrl } = body;

    if (!photoUrl && !receiptUrl) {
      return NextResponse.json(
        { error: "Photo or receipt URL is required" },
        { status: 400 }
      );
    }

    // Fetch task with checklist and property
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select(`
        *,
        task_checklists!inner(
          id,
          property_id,
          properties!inner(
            id,
            user_id
          )
        )
      `)
      .eq("id", id)
      .eq("task_checklists.properties.user_id", user.id)
      .single();

    if (taskError || !task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Verify the photo using AI
    const verificationUrl = photoUrl || receiptUrl;
    const result = await verifyTaskPhoto(
      verificationUrl,
      task.task_name,
      task.description,
      task.verification_type,
      []
    );

    // Create verification record
    const { data: verification, error: verificationError } = await supabase
      .from("verifications")
      .insert({
        task_id: id,
        photo_url: photoUrl || null,
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
    const updateData: any = {
      status: result.isVerified ? "verified" : "rejected",
      verification_result: result,
      verified_at: result.isVerified ? new Date().toISOString() : null,
      completed_at: new Date().toISOString(),
      photo_url: photoUrl || task.photo_url,
      receipt_url: receiptUrl || task.receipt_url,
    };

    const { error: updateError } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id);

    if (updateError) throw updateError;

    // If verified, calculate and award points
    if (result.isVerified) {
      // Get property ID from checklist
      const checklist = Array.isArray(task.task_checklists)
        ? task.task_checklists[0]
        : task.task_checklists;
      const property = Array.isArray(checklist.properties)
        ? checklist.properties[0]
        : checklist.properties;
      const propertyId = checklist.property_id || property?.id;

      // Calculate points (simplified - just base points)
      const pointsBreakdown = calculatePointsForTask(
        task.base_points_value,
        task.frequency,
        task.verification_type,
        0, // No streak tracking
        0  // No early completion bonus
      );

      // Update task with points earned
      await supabase
        .from("tasks")
        .update({ points_earned: pointsBreakdown.totalPoints })
        .eq("id", id);

      // Create reward record
      const { data: reward, error: rewardError } = await supabase
        .from("rewards")
        .insert({
          user_id: user.id,
          task_id: id,
          points_earned: pointsBreakdown.totalPoints,
          base_points: pointsBreakdown.basePoints,
          frequency_multiplier: 1,
          verification_bonus: 0,
          streak_bonus: 0,
          early_completion_bonus: 0,
        })
        .select()
        .single();

      if (rewardError) {
        console.error("Failed to create reward:", rewardError);
      }

      // Update user's total points and tier
      const { data: userProfile } = await supabase
        .from("users")
        .select("total_points_earned")
        .eq("id", user.id)
        .single();

      const newTotalPoints =
        (userProfile?.total_points_earned || 0) + pointsBreakdown.totalPoints;
      const newTier = getCurrentTier(newTotalPoints);

      await supabase
        .from("users")
        .update({
          total_points_earned: newTotalPoints,
          current_tier: newTier.tierName,
        })
        .eq("id", user.id);

      // Update property safety score as percentage
      // Reuse propertyId from above (already extracted from checklist)
      if (propertyId) {
        // Recalculate safety score as percentage
        const safetyScorePercentage = await calculateSafetyScorePercentage(
          supabase,
          propertyId
        );

        await supabase
          .from("properties")
          .update({ safety_score: safetyScorePercentage })
          .eq("id", propertyId);
      }

      // Publish task completion to VeChain blockchain (async, don't block)
      try {
        // Hash photos/receipts if available
        let photoHash: string | undefined;
        let receiptHash: string | undefined;

        if (photoUrl) {
          photoHash = await hashFile(photoUrl);
        }
        if (receiptUrl) {
          receiptHash = await hashFile(receiptUrl);
        }

        const taskMetadata = {
          taskId: id,
          propertyId: propertyId!,
          userId: user.id,
          taskName: task.task_name,
          completedAt: new Date().toISOString(),
          photoHash,
          receiptHash,
          verificationConfidence: result.confidence,
          pointsEarned: pointsBreakdown.totalPoints,
          basePoints: pointsBreakdown.basePoints,
        };

        const txHash = await publishTaskCompletion(taskMetadata);

        // Create blockchain transaction record
        await (supabase.from("blockchain_transactions") as any).insert({
          task_id: id,
          user_id: user.id,
          property_id: propertyId,
          vechain_tx_hash: txHash,
          metadata: taskMetadata,
          status: "pending",
          event_type: "task_completion",
        });
      } catch (blockchainError: any) {
        // Log error but don't fail task completion
        console.error("Failed to publish task completion to blockchain:", blockchainError);
        // Optionally create a failed transaction record
        try {
          await (supabase.from("blockchain_transactions") as any).insert({
            task_id: id,
            user_id: user.id,
            property_id: propertyId,
            vechain_tx_hash: `failed-${Date.now()}`,
            metadata: {
              taskId: id,
              userId: user.id,
              error: blockchainError.message,
            },
            status: "failed",
            event_type: "task_completion",
          });
        } catch (recordError) {
          console.error("Failed to record blockchain error:", recordError);
        }
      }
    }

    // Get points earned if task was verified
    let pointsEarned = null;
    if (result.isVerified) {
      // We already calculated and stored points_earned in the task
      // Fetch it from the database to ensure we have the latest value
      const { data: updatedTask } = await supabase
        .from("tasks")
        .select("points_earned")
        .eq("id", id)
        .single();
      pointsEarned = updatedTask?.points_earned || null;
    }

    return NextResponse.json({
      verification,
      result,
      pointsEarned,
      task: {
        ...task,
        ...updateData,
        points_earned: pointsEarned || task.points_earned,
      },
    });
  } catch (error: any) {
    console.error("Task completion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete task" },
      { status: 500 }
    );
  }
}

