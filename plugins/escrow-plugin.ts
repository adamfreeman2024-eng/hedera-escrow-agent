/**
 * Enterprise Plugin: Order Delivery & Dispute Verification
 * Ստուգում է պատվերի կարգավիճակը և արդյոք կա բացված վեճ (Dispute):
 */
export const verifyDeliveryStatus = async (orderId: string) => {
  console.log(`[Escrow Plugin] Ստուգվում է պատվերի կարգավիճակը: ID - ${orderId}`);
  
  // Այստեղ իրականում կլիներ API հարցում դեպի OnlineMall-ի տվյալների բազա, 
  // բայց այս պահին մենք սիմուլյացիա (mock) ենք անում AI-ի և մրցույթի համար:
  
  const formattedId = orderId.toUpperCase();

  // Պարզ տրամաբանություն դեմոյի համար.
  // Եթե orderId-ն սկսվում է 'D'-ով, համարում ենք Delivered (Առաքված)
  // Եթե 'C'-ով է, համարում ենք ունի բացված Case (Dispute/Վեճ)
  
  if (formattedId.startsWith('D')) {
    return {
      orderId: formattedId,
      status: "DELIVERED",
      hasDispute: false,
      message: "Ապրանքը բարեհաջող հասել է գնորդին, և 48 ժամն անցել է: Կարող եք ազատել գումարը և փոխանցել վաճառողին (Escrow Release):"
    };
  } else if (formattedId.startsWith('C')) {
    return {
      orderId: formattedId,
      status: "ON_HOLD",
      hasDispute: true,
      message: "ՈՒՇԱԴՐՈՒԹՅՈՒՆ. Գնորդը բացել է վեճ (Dispute): Գումարը պետք է մնա սառեցված մինչև հարցի լուծումը:"
    };
  } else {
     return {
      orderId: formattedId,
      status: "IN_TRANSIT",
      hasDispute: false,
      message: "Ապրանքը դեռ ճանապարհին է (In Transit): Գումարը պետք է մնա սառեցված (Escrow) վիճակում:"
    };
  }
};