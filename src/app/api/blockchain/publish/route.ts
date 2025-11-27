import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { publishTaskCompletion, hashFile } from "@/lib/blockchain/vechain";

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
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Fetch task with all related data
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
      .eq("id", taskId)
      .single() as any;

    if (taskError || !task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Verify user ownership
    const checklist = Array.isArray(task.task_checklists)
      ? task.task_checklists[0]
      : task.task_checklists;
    const property = Array.isArray(checklist?.properties)
      ? checklist.properties[0]
      : checklist?.properties;
    
    if (!property || property.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Only publish verified tasks
    if (task.status !== "verified") {
      return NextResponse.json(
        { error: "Only verified tasks can be published to blockchain" },
        { status: 400 }
      );
    }

    // Check if already published
    const { data: existingTx } = await supabase
      .from("blockchain_transactions")
      .select("*")
      .eq("task_id", taskId)
      .single();

    if (existingTx) {
      return NextResponse.json({
        transaction: existingTx,
        message: "Task already published to blockchain",
      });
    }

    // Get property ID
    const propertyId = checklist.property_id;

    // Hash photos/receipts if available
    let photoHash: string | undefined;
    let receiptHash: string | undefined;

    if (task.photo_url) {
      photoHash = await hashFile(task.photo_url);
    }
    if (task.receipt_url) {
      receiptHash = await hashFile(task.receipt_url);
    }

    // Prepare metadata
    const metadata = {
      taskId: task.id,
      propertyId: propertyId,
      userId: user.id,
      taskName: task.task_name,
      completedAt: task.completed_at || task.verified_at,
      photoHash,
      receiptHash,
      verificationConfidence:
        task.verification_result?.confidence || 0,
      pointsEarned: task.points_earned || 0,
      basePoints: task.base_points_value,
    };

    // Publish to VeChain
    const txHash = await publishTaskCompletion(metadata);

    // Create blockchain transaction record
    const { data: blockchainTx, error: txError } = await (supabase
      .from("blockchain_transactions") as any)
      .insert({
        task_id: taskId,
        user_id: user.id,
        property_id: propertyId,
        vechain_tx_hash: txHash,
        metadata: metadata,
        status: "pending",
      })
      .select()
      .single();

    if (txError) throw txError;

    return NextResponse.json({
      transaction: blockchainTx,
      message: "Task published to VeChain blockchain",
    });
  } catch (error: any) {
    console.error("Blockchain publish error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to publish to blockchain" },
      { status: 500 }
    );
  }
}

