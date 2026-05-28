import { Client, TransferTransaction, Hbar, HbarUnit } from "@hashgraph/sdk";

export const lockFundsOnHedera = async (amount: number): Promise<string> => {
  const operatorId = process.env.HEDERA_TESTNET_OPERATOR_ID;
  const operatorKey = process.env.HEDERA_TESTNET_OPERATOR_KEY;

  if (!operatorId || !operatorKey) {
    throw new Error("Hedera credentials missing in .env");
  }

  const client = Client.forTestnet();
  client.setOperator(operatorId, operatorKey);

  try {
    const demoAmount = 0.001; 

    const transaction = new TransferTransaction()
      .addHbarTransfer(operatorId, new Hbar(-demoAmount, HbarUnit.Hbar))
      .addHbarTransfer("0.0.3", new Hbar(demoAmount, HbarUnit.Hbar)) 
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