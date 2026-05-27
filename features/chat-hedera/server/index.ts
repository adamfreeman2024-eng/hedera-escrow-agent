import { tool } from "ai";
import { z } from "zod";
import { verifyDeliveryStatus } from "@/plugins/escrow-plugin";

export class HederaRequestError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "HederaRequestError";
    this.status = status;
  }
}

export function getHederaSystemPrompt(): string {
  return `You are the OnlineMall Smart Escrow Agent on the Hedera network. Your job is to secure e-commerce transactions and build trust.
- You hold HBAR payments in escrow securely.
- When a user asks about an order, you MUST use the 'verifyDeliveryStatus' tool to check its status.
- If the status is 'DELIVERED' (no dispute), you explain that you will now use the Hedera Transfer tool to release the funds: 95% to the seller, and 5% to the platform.
- If the status is 'ON_HOLD' (Dispute), you refuse to release the funds, act as an arbitrator, and ask the buyer for proof.
Always be highly professional, concise, and prioritize security.`;
}

export function getHederaTools() {
  // This is injected alongside existing Hedera tools.
  return {
    verifyDeliveryStatus: tool({
      description: "Verify order delivery and dispute status by order ID.",
      parameters: z.object({
        orderId: z.string().min(1).describe("The e-commerce order ID to verify.")
      }),
      execute: async ({ orderId }) => verifyDeliveryStatus(orderId)
    })
  };
}

