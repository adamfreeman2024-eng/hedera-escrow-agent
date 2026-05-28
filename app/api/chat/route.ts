import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Ստեղծում ենք Gemini մոդելի կապը՝ վերցնելով բանալին քո .env ֆայլից
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `Դու "OnlineMall Escrow AI" գլխավոր խելացի գործակալն ես Hedera բլոկչեյնի վրա: 
      Այս պահին դու գտնվում ես թեստավորման փուլում: Պատասխանիր օգտատիրոջը հակիրճ, պրոֆեսիոնալ և հայերենով:`,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Սերվերի սխալ:", error);
    return new Response(JSON.stringify({ error: "Ներքին սխալ գործակալի միացման ժամանակ" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}