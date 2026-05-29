import OpenAI from 'openai';
import { lockFundsOnHedera, releaseFundsOnHedera } from '../../../plugins/hedera-service';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const chatMessages: any[] = (messages as Array<any>).map(m => ({
      role: m.role,
      content: m.content
    }));

    chatMessages.unshift({
      role: 'system',
      content: 'You are the "OnlineMall Escrow AI" assistant. Always respond in polite, professional English. Help buyers lock their funds, check delivery statuses, and release funds to the seller when delivery is successful. Format transaction links like this: [View on Hashscan](https://hashscan.io/...)'
    });

    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: chatMessages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'lock_funds',
            description: 'Locks the buyer funds in a smart contract on Hedera network.',
            parameters: { type: 'object', properties: { amount: { type: 'number' } }, required: ['amount'] }
          }
        },
        {
          type: 'function',
          function: {
            name: 'check_delivery_status',
            description: 'Checks the delivery status of an order using its tracking ID.',
            parameters: { type: 'object', properties: { tracking_id: { type: 'string' } }, required: ['tracking_id'] }
          }
        },
        // --- ՆՈՐ ԳՈՐԾԻՔ: ԳՈՒՄԱՐԻ ԲԱՑԹՈՂՈՒՄ (RELEASE) ---
        {
          type: 'function',
          function: {
            name: 'release_funds',
            description: 'Releases the escrowed funds to the seller.',
            parameters: { type: 'object', properties: { amount: { type: 'number' } }, required: ['amount'] }
          }
        }
      ]
    });

    const aiMessage = response.choices[0].message;

    if (aiMessage.tool_calls && Array.isArray(aiMessage.tool_calls) && aiMessage.tool_calls.length > 0) {
      const toolCall = aiMessage.tool_calls[0] as any;

      if (toolCall.type === 'function') {
        const args = JSON.parse(toolCall.function.arguments);
        let toolResponseString = "";

        // --- ԱՐԴԵՆ ԱՇԽԱՏՈՂ ՏՐԱՄԱԲԱՆՈՒԹՅՈՒՆ (ԱՆՓՈՓՈԽ) ---
        if (toolCall.function.name === 'lock_funds') {
          const transactionResult = await lockFundsOnHedera(args.amount);
          toolResponseString = `Transaction Result: ${transactionResult}`;
          
        } else if (toolCall.function.name === 'check_delivery_status') {
          const isDelivered = args.tracking_id.endsWith('777');
          const status = isDelivered ? "Delivered" : "In Transit";
          toolResponseString = `Delivery Status: ${status}`;
          
        // --- ՆՈՐ ՏՐԱՄԱԲԱՆՈՒԹՅՈՒՆ: ԵԹԵ AI-Ը ՈՐՈՇՈՒՄ Է ԲԱՑ ԹՈՂՆԵԼ ԳՈՒՄԱՐԸ ---
        } else if (toolCall.function.name === 'release_funds') {
          const transactionResult = await releaseFundsOnHedera(args.amount);
          toolResponseString = `Funds Released Successfully. Transaction: ${transactionResult}`;
        }

        chatMessages.push({
          role: 'assistant',
          content: aiMessage.content ?? null,
          tool_calls: aiMessage.tool_calls ?? null,
        } as any);
        
        chatMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResponseString
        } as any);

        const finalResponse = await openai.chat.completions.create({
          model: 'deepseek-chat',
          messages: chatMessages
        });

        return Response.json({ content: finalResponse.choices[0].message.content });
      }
    }

    return Response.json({ content: aiMessage.content });

  } catch (error: any) {
    console.error("Backend Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}