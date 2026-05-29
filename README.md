# 🛡️ OnlineMall Escrow AI Agent

**Enterprise-grade AI Escrow Agent on Hedera, tying smart contract fund releases to real-world logistics data.**

![Hedera](https://img.shields.io/badge/Hedera-Hashgraph-black?style=for-the-badge&logo=hedera)
![OpenAI](https://img.shields.io/badge/AI-DeepSeek_LLM-blue?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-React-black?style=for-the-badge&logo=next.js)

## 🏆 Hedera AI Agent Bounty Submission
**Track:** Week 2: Enterprise Agent + Plugin. Integrate Hedera Agent Kit with a real-world tool.

---

## 📖 Overview
In modern e-commerce, trust between buyers and sellers is the biggest hurdle. Buyers fear paying for goods that never arrive, and sellers fear sending goods without guaranteed payment. 

The **OnlineMall Escrow AI Agent** solves this by acting as an intelligent, autonomous middleman. It leverages the Hedera network for secure, low-fee cryptocurrency locking and utilizes AI agentic reasoning connected to a real-world logistics tool (Delivery Tracking Plugin) to ensure funds are *only* released when physical goods are proven to be delivered.

## ✨ Key Features & Agentic Reasoning

Our AI Agent doesn't just blindly execute transactions; it acts with **strict business logic**:

1. **Secure Fund Locking:** Buyers can instruct the agent to lock HBAR into the Escrow account. The agent autonomously generates the Hedera `TransferTransaction`.
2. **Real-world Logistics Plugin:** The agent uses a custom `check_delivery_status` tool to query a logistics/courier database using a Tracking ID (e.g., TRK-777). 
3. **Autonomous Multi-Sig Release:** Once delivery is confirmed via the plugin, the agent initiates a payout from the Escrow wallet to the Seller. It handles ECDSA private keys securely on the backend.
4. **🧠 Smart Guardrails (Agentic Reasoning):** If a user demands the agent to release funds *before* delivery is verified, the agent **refuses** the transaction, cites the Escrow security policy, and prompts the user to check the delivery status first.

## 🏗️ Architecture

1. **Frontend:** React / Next.js interface mimicking an e-commerce dashboard.
2. **AI Layer:** DeepSeek LLM processes natural language, understands user intent, and maps it to specific tool calls.
3. **Blockchain Layer (`hedera-service.ts`):** * **Locking:** Transfers HBAR from Buyer -> Escrow.
   * **Releasing:** Uses Escrow Account's `ECDSA_SECP256K1` Private Key to sign the release transaction (Escrow -> Seller), while the platform operator pays the gas fee.

## 🚀 Getting Started (Local Setup)

### Prerequisites
* Node.js (v18+)
* Hedera Testnet Accounts (Operator/Buyer, Escrow, Seller)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YourUsername/onlinemall-escrow-ai.git](https://github.com/YourUsername/onlinemall-escrow-ai.git)
   cd onlinemall-escrow-ai
   Install dependencies:

Bash
npm install
Environment Setup:
Create a .env.local file in the root directory and add your credentials:

# Buyer / Operator Wallet
HEDERA_TESTNET_OPERATOR_ID=0.0.xxx
HEDERA_TESTNET_OPERATOR_KEY=302e...

# Escrow Wallet (Holds the locked funds)
ESCROW_ACCOUNT_ID=0.0.xxx
ESCROW_PRIVATE_KEY=c47d... # ECDSA Key Format

# Seller Wallet (Receives the funds)
SELLER_ACCOUNT_ID=0.0.xxx

# AI Provider
DEEPSEEK_API_KEY=your_deepseek_api_key_here

Run the Development Server:

Bash
npm run dev


🧪 Demo / Testing Script for Judges
Once the server is running at localhost:3000, open the chat interface and type the following commands in order to test the Agentic Reasoning:

Lock Funds:

User: `"Please lock 5 HBAR for order 541."*

Agent Action: Executes Hedera transaction and returns a live Hashscan link showing funds moved to Escrow.

Attempt Premature Release (Testing Guardrails):

User: `"Please release the 5 HBAR for order 541 to the seller."*

Agent Action: REJECTS the request. States that funds cannot be released because the delivery status is unverified.

Use the Logistics Plugin:

User: `"Can you check my delivery status? My Track ID is TRK-777."*

Agent Action: Queries the plugin, verifies the package is delivered, and updates its context.

Successful Release:

User: `"Please release the 5 HBAR for order 541 to the seller."*

Agent Action: Recognizes the delivery is now verified, signs the transaction with the Escrow Private Key, and provides the Hashscan link for the final payout to the seller.

👥 Team
Mayis - Project Lead & Strategy (founder bitluma.com)

Alik - Full-Stack & UI Development

Narek - Web3 Architecture & AI Tool Integration

