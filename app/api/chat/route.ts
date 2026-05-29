import OpenAI from 'openai';
import { lockFundsOnHedera } from '../../../plugins/hedera-service';

// Use the official OpenAI npm package with the DeepSeek API endpoint
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Prepare chat messages and add a system prompt
    const chatMessages: any[] = (messages as Array<any>).map(m => ({
      role: m.role,
      content: m.content
    }));

    // ԱՅՍՏԵՂ ՓՈԽԵԼ ԵՆՔ ԱՆԳԼԵՐԵՆԻ
    chatMessages.unshift({
      role: 'system',
      content: 'You are the "OnlineMall Escrow AI" assistant. Always respond in polite, professional English. Help buyers lock their funds on the Hedera network. When you provide a transaction link, format it exactly like this: [View on Hashscan](https://hashscan.io/...)'
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
            parameters: {
              type: 'object',
              properties: {
                amount: { type: 'number', description: 'Amount in HBAR' }
              },
              required: ['amount']
            }
          }
        }
      ]
    });

    const aiMessage = response.choices[0].message;

    if (
      aiMessage.tool_calls &&
      Array.isArray(aiMessage.tool_calls) &&
      aiMessage.tool_calls.length > 0
    ) {
      const toolCall = aiMessage.tool_calls[0] as any;

      if (toolCall.type === 'function' && toolCall.function?.name === 'lock_funds') {
        const args = JSON.parse(toolCall.function.arguments);

        const transactionResult = await lockFundsOnHedera(args.amount);

        chatMessages.push({
          role: 'assistant',
          content: aiMessage.content ?? null,
          tool_calls: aiMessage.tool_calls ?? null,
        } as any);
        
        chatMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: `Transaction Result: ${transactionResult}`
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