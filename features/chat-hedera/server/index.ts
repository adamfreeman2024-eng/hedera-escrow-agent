export class HederaRequestError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "HederaRequestError";
    this.status = status;
  }
}

export function getHederaSystemPrompt(): string {
  return "You are the OnlineMall Smart Escrow Agent for Hedera (placeholder system prompt).";
}

export function getHederaTools() {
  return [];
}

