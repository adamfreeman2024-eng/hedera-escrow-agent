import { generateText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { lockFundsOnHedera } from '../../../plugins/hedera-service';

// Կարևոր է՝ հեռացրել եմ compatibility-ն, որը խանգարում էր
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await generateText({
      model: deepseek('deepseek-chat'),
      system: `You are the "OnlineMall Escrow AI". Manage Hedera transactions efficiently.`,
      messages,
      tools: {
        lock_funds: tool({
          description: 'Locks the buyer\'s funds in a smart contract.',
          parameters: z.object({ amount: z.number().describe('The amount in HBAR') }),
          execute: async ({ amount }) => {
            const txLink = await lockFundsOnHedera(amount);
            return { success: txLink !== "ERROR", message: txLink };
          },
        } as any), // as any-ը հանում է կարմիր գծերը
      },
    });

    return Response.json({ content: result.text || 'Գործողությունը կատարված է' });
  } catch (error: any) {
    console.error("Backend Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}