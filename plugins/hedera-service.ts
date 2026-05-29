import { Client, TransferTransaction, Hbar, HbarUnit } from "@hashgraph/sdk";

export const lockFundsOnHedera = async (amount: number): Promise<string> => {
  const operatorId = process.env.HEDERA_TESTNET_OPERATOR_ID;
  const operatorKey = process.env.HEDERA_TESTNET_OPERATOR_KEY;

  // 1. Այստեղ պետք է լինի քո Escrow (երաշխավոր) հաշվի ID-ն:
  // Առայժմ ես դրել եմ պայմանական հաշիվ, բայց դու այն պետք է փոխարինես իրական ստացողի հաշվով:
  const escrowAccountId = process.env.ESCROW_ACCOUNT_ID || "0.0.1234567"; 

  if (!operatorId || !operatorKey) {
    throw new Error("Hedera credentials missing in .env");
  }

  const client = Client.forTestnet();
  client.setOperator(operatorId, operatorKey);

  try {
    // 2. Մենք ջնջեցինք demoAmount-ը և օգտագործում ենք իրական amount փոփոխականը
    const transaction = new TransferTransaction()
      .addHbarTransfer(operatorId, new Hbar(-amount, HbarUnit.Hbar)) // Հանում ենք գնորդի հաշվից
      .addHbarTransfer(escrowAccountId, new Hbar(amount, HbarUnit.Hbar)) // Ուղարկում ենք քո Escrow հաշվին
      .freezeWith(client);

    const signTx = await transaction.signWithOperator(client);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    
    const txIdString = txResponse.transactionId.toString();
    const parts = txIdString.split('@');
    const timeParts = parts[1].split('.');
    const hashscanId = `${parts[0]}-${timeParts[0]}-${timeParts[1]}`;
    
    return `https://hashscan.io/testnet/transaction/${hashscanId}`;
  } catch (error) {
    console.error("Hedera Transaction Error:", error);
    return "ERROR";
  }
};