import { Client, TransferTransaction, Hbar, HbarUnit, PrivateKey } from "@hashgraph/sdk";

// --- ԱՅՍ ՄԱՍԸ ՔՈ ԱՐԴԵՆ ԱՇԽԱՏՈՂ ԿՈԴՆ Է (ԱՆՓՈՓՈԽ) ---
export const lockFundsOnHedera = async (amount: number): Promise<string> => {
  const operatorId = process.env.HEDERA_TESTNET_OPERATOR_ID;
  const operatorKey = process.env.HEDERA_TESTNET_OPERATOR_KEY;
  const escrowAccountId = process.env.ESCROW_ACCOUNT_ID || "0.0.1234567"; 

  if (!operatorId || !operatorKey) {
    throw new Error("Hedera credentials missing in .env");
  }

  const client = Client.forTestnet();
  client.setOperator(operatorId, operatorKey);

  try {
    const transaction = new TransferTransaction()
      .addHbarTransfer(operatorId, new Hbar(-amount, HbarUnit.Hbar)) 
      .addHbarTransfer(escrowAccountId, new Hbar(amount, HbarUnit.Hbar)) 
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

// --- ԹԱՐՄԱՑՎԱԾ ՖՈՒՆԿՑԻԱՆ, ՈՐԸ ԳՈՒՄԱՐԸ ՀԱՆՈՒՄ Է ESCROW-ԻՑ ԵՎ ՏԱԼԻՍ ՎԱՃԱՌՈՂԻՆ ---
export const releaseFundsOnHedera = async (amount: number): Promise<string> => {
  // Ստանում ենք Escrow-ի տվյալները (գումարը այստեղից է դուրս գալու)
  const escrowId = process.env.ESCROW_ACCOUNT_ID;
  const escrowKey = process.env.ESCROW_PRIVATE_KEY;
  
  // Վաճառողի դրամապանակը (գումարը այստեղ է գնալու)
  const sellerAccountId = process.env.SELLER_ACCOUNT_ID || "0.0.9999999"; 

  if (!escrowId || !escrowKey) {
    console.error("Escrow credentials missing in .env");
    throw new Error("Escrow credentials missing in .env");
  }

  const client = Client.forTestnet();
  
  // ԿԱՐԵՎՈՐ ՓՈՓՈԽՈՒԹՅՈՒՆԸ ԱՅՍՏԵՂ Է.
  // Մենք փոխակերպում ենք տեքստային բանալին ճիշտ ECDSA ֆորմատի, նոր տալիս ենք client-ին
  const escrowPrivateKey = PrivateKey.fromStringECDSA(escrowKey);
  
  // ԿԱՐԵՎՈՐ Է. Մենք որպես օպերատոր դնում ենք Escrow-ին և փոխանցում ենք ճիշտ ֆորմատավորված բանալին
  client.setOperator(escrowId, escrowPrivateKey);

  try {
    const transaction = new TransferTransaction()
      .addHbarTransfer(escrowId, new Hbar(-amount, HbarUnit.Hbar)) // Հանում ենք Escrow-ից
      .addHbarTransfer(sellerAccountId, new Hbar(amount, HbarUnit.Hbar)) // Ուղարկում ենք Վաճառողին
      .freezeWith(client);

    const signTx = await transaction.signWithOperator(client);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    
    // Hashscan հղման աշխատող գեներացիան մնում է անփոփոխ
    const txIdString = txResponse.transactionId.toString();
    const parts = txIdString.split('@');
    const timeParts = parts[1].split('.');
    const hashscanId = `${parts[0]}-${timeParts[0]}-${timeParts[1]}`;
    
    return `https://hashscan.io/testnet/transaction/${hashscanId}`;
  } catch (error) {
    console.error("Hedera Release Error:", error);
    return "ERROR";
  }
};