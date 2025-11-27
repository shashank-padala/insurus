import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { verifyTaskPhoto } from "@/lib/ai/photo-verification";
import {
  calculatePointsForTask,
  calculateSafetyScoreChange,
} from "@/lib/rewards/points-calculation";
import { getCurrentTier } from "@/constants/rewards-system";

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

      // Calculate consecutive months for streak bonus
      const { data: streakData } = await supabase
        .from("task_completion_streaks")
        .select("*")
        .eq("user_id", user.id)
        .eq("property_id", propertyId)
        .eq("template_id", task.template_id || "")
        .single();

      const lastCompleted = streakData?.last_completed_month
        ? new Date(streakData.last_completed_month)
        : null;
      const currentMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const isConsecutive =
        lastCompleted &&
        lastCompleted.getFullYear() === currentMonth.getFullYear() &&
        lastCompleted.getMonth() === currentMonth.getMonth() - 1;

      const consecutiveMonths = isConsecutive
        ? (streakData?.consecutive_months || 1) + 1
        : 1;

      // Update or create streak
      if (streakData) {
        await supabase
          .from("task_completion_streaks")
          .update({
            consecutive_months: consecutiveMonths,
            last_completed_month: currentMonth.toISOString().split("T")[0],
          })
          .eq("id", streakData.id);
      } else if (task.template_id && propertyId) {
        await supabase.from("task_completion_streaks").insert({
          user_id: user.id,
          property_id: propertyId,
          template_id: task.template_id,
          consecutive_months: 1,
          last_completed_month: currentMonth.toISOString().split("T")[0],
        });
      }

      // Calculate days early (if completed before due date)
      const dueDate = new Date(task.due_date);
      const completedDate = new Date();
      const daysEarly = Math.max(
        0,
        Math.floor((dueDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      // Calculate points
      const pointsBreakdown = calculatePointsForTask(
        task.base_points_value,
        task.frequency,
        task.verification_type,
        consecutiveMonths,
        daysEarly
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
          frequency_multiplier: pointsBreakdown.frequencyMultiplier,
          verification_bonus: pointsBreakdown.verificationBonus,
          streak_bonus: pointsBreakdown.streakBonus,
          early_completion_bonus: pointsBreakdown.earlyCompletionBonus,
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

      // Update safety score
      const scoreChange = calculateSafetyScoreChange(
        task.base_points_value,
        true
      );

      const { data: currentUser } = await supabase
        .from("users")
        .select("safety_score")
        .eq("id", user.id)
        .single();

      const newSafetyScore = Math.min(
        1000,
        Math.max(0, (currentUser?.safety_score || 100) + scoreChange)
      );

      await supabase
        .from("users")
        .update({ safety_score: newSafetyScore })
        .eq("id", user.id);

      // Blockchain integration disabled - will be added later
      // TODO: Re-enable blockchain publishing when ready
      /*
      // Queue blockchain transaction (publish asynchronously)
      // This will be handled by a background job or called separately
      try {
        const publishResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/blockchain/publish`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: request.headers.get("Cookie") || "",
            },
            body: JSON.stringify({ taskId: id }),
          }
        );
        // Don't fail if blockchain publish fails
        if (!publishResponse.ok) {
          console.warn("Failed to publish to blockchain:", await publishResponse.text());
        }
      } catch (blockchainError) {
        console.warn("Blockchain publish error:", blockchainError);
        // Continue even if blockchain publish fails
      }
      */
    }

    return NextResponse.json({
      verification,
      result,
      task: {
        ...task,
        ...updateData,
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

