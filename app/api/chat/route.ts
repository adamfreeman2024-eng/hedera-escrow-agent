import { generateText } from 'ai';
// Օգտագործում ենք հատուկ DeepSeek-ի պաշտոնական գրադարանը
import { deepseek } from '@ai-sdk/deepseek';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await generateText({
      // Միանգամից կանչում ենք deepseek մոդելը
      model: deepseek('deepseek-chat'), 
      system: `Դու "OnlineMall Escrow AI" գլխավոր խելացի գործակալն ես Hedera բլոկչեյնի վրա: 
      Պատասխանիր հաճախորդներին հակիրճ, պրոֆեսիոնալ և միայն հայերենով:`,
      messages,
    });

    return Response.json({ content: result.text });
    
  } catch (error: any) {
    console.error("DeepSeek-ի սխալը:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json({ error: `Իրական սխալը (DeepSeek): ${errorMessage}` }, { status: 500 });
  }
}