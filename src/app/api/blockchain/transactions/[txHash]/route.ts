import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ txHash: string }> }
) {
  try {
    const { txHash } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch transaction from database
    const { data: transaction, error: dbError } = await (supabase
      .from("blockchain_transactions") as any)
      .select("*")
      .eq("vechain_tx_hash", txHash)
      .eq("user_id", user.id)
      .single();

    if (dbError || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check transaction status on VeChain (optional - can be implemented with VeChain SDK)
    // For now, return the database record
    // TODO: Implement VeChain transaction receipt checking when SDK is fully integrated
    // This would involve:
    // 1. Querying VeChain testnet for transaction receipt
    // 2. Updating status from 'pending' to 'confirmed' if transaction is confirmed
    // 3. Storing confirmed_at timestamp

    return NextResponse.json(transaction as any);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

