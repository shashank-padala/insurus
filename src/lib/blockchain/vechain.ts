// VeChain integration using HTTP API
// For testnet, we'll use VeChain's REST API endpoints

const network = process.env.VECHAIN_NETWORK || "testnet";
const testnetUrl = process.env.VECHAIN_TESTNET_URL || "https://testnet.vechain.org";

/**
 * Get VeChain testnet API endpoint
 */
function getVeChainApiUrl(): string {
  return testnetUrl;
}

/**
 * Prepare transaction metadata for blockchain
 */
export interface TaskCompletionMetadata {
  taskId: string;
  propertyId: string;
  userId: string;
  taskName: string;
  completedAt: string;
  photoHash?: string;
  receiptHash?: string;
  verificationConfidence: number;
  pointsEarned: number;
  basePoints: number;
}

/**
 * Property registration metadata for blockchain
 */
export interface PropertyRegistrationMetadata {
  propertyId: string;
  userId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  propertyType: string;
  safetyDevices: string[];
  registeredAt: string;
}

/**
 * Create a hash of the photo/receipt for blockchain storage
 */
export async function hashFile(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (error) {
    console.error("Error hashing file:", error);
    return "";
  }
}

/**
 * Build and sign a VeChain transaction with data clause
 * Using VeChain's HTTP API for simplicity
 */
async function buildAndSignTransaction(
  data: string,
  toAddress?: string
): Promise<string> {
  const privateKey = process.env.VECHAIN_PRIVATE_KEY;
  const walletAddress = process.env.VECHAIN_WALLET_ADDRESS;

  if (!privateKey) {
    throw new Error("VECHAIN_PRIVATE_KEY not configured");
  }
  if (!walletAddress) {
    throw new Error("VECHAIN_WALLET_ADDRESS not configured");
  }

  // For now, we'll create a transaction hash that represents the data
  // In production, you would use a VeChain SDK or HTTP API to:
  // 1. Get the best block reference
  // 2. Build the transaction with data clause
  // 3. Sign it with the private key
  // 4. Broadcast it to the network
  
  // Simplified implementation: Create a deterministic hash from the data
  // This will be replaced with actual VeChain transaction when SDK is properly configured
  const dataBuffer = Buffer.from(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  
  // Create a transaction-like hash (66 chars: 0x + 64 hex)
  const txHash = `0x${hashHex}${Date.now().toString(16).slice(-8)}`;
  
  // TODO: Replace with actual VeChain SDK transaction:
  // - Use @vechain/sdk-core or thor-client to build transaction
  // - Sign with private key
  // - Send to VeChain testnet via HTTP API
  // - Return actual transaction hash from network
  
  console.log("VeChain transaction (placeholder):", {
    hash: txHash,
    dataLength: data.length,
    network: network,
  });

  return txHash;
}

/**
 * Publish property registration to VeChain blockchain
 */
export async function publishPropertyRegistration(
  metadata: PropertyRegistrationMetadata
): Promise<string> {
  try {
    const metadataJson = JSON.stringify({
      type: "property_registration",
      ...metadata,
    });

    const txHash = await buildAndSignTransaction(metadataJson);
    return txHash;
  } catch (error: any) {
    console.error("Error publishing property registration to VeChain:", error);
    throw new Error(`Failed to publish to VeChain: ${error.message}`);
  }
}

/**
 * Publish task completion to VeChain blockchain
 */
export async function publishTaskCompletion(
  metadata: TaskCompletionMetadata
): Promise<string> {
  try {
    const metadataJson = JSON.stringify({
      type: "task_completion",
      ...metadata,
    });

    const txHash = await buildAndSignTransaction(metadataJson);
    return txHash;
  } catch (error: any) {
    console.error("Error publishing task completion to VeChain:", error);
    throw new Error(`Failed to publish to VeChain: ${error.message}`);
  }
}

