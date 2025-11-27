import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getVeChainClient } from "@/lib/blockchain/vechain";

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

    // Check transaction status on VeChain
    try {
      const client = getVeChainClient();
      const receipt = await client.transactions.getTransactionReceipt(txHash);

      if (receipt) {
        const isConfirmed = receipt.meta?.blockNumber !== undefined;
        const confirmedAt = receipt.meta?.blockTimestamp
          ? new Date(receipt.meta.blockTimestamp * 1000).toISOString()
          : null;

        // Update transaction status if changed
        if ((transaction as any).status !== "confirmed" && isConfirmed) {
          await (supabase
            .from("blockchain_transactions") as any)
            .update({
              status: "confirmed",
              confirmed_at: confirmedAt,
            })
            .eq("id", transaction.id);
        }

        return NextResponse.json({
          ...(transaction as any),
          status: isConfirmed ? "confirmed" : "pending",
          confirmedAt,
          receipt,
        });
      }
    } catch (chainError) {
      console.error("Error checking blockchain:", chainError);
      // Return database record even if blockchain check fails
    }

    return NextResponse.json(transaction as any);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

