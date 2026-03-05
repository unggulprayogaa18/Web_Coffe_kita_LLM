import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { db } from '@/lib/db';
import { PROMO_GENERATOR_PROMPT } from '@/lib/ai/prompts';

export async function POST() {
  try {
    // 1. Ambil data pelanggan dari database Neon
    const customers = await db.customer.findMany();
    
    const customerDataSummary = customers.map(c => ({
      drink: c.favoriteDrink,
      interests: c.interests
    }));

    // 2. Panggil AI menggunakan Groq (Tanpa ribet urusan GCP)
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'), 
      system: PROMO_GENERATOR_PROMPT,
      prompt: `Analisis data tren pelanggan Kopi Kita ini: ${JSON.stringify(customerDataSummary)}. Buatlah promo yang paling cocok.`,
    });

    // 3. Bersihkan hasil jika AI memberikan tag markdown
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return new Response(cleanJson, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Groq Generation Error:", error);
    return new Response(
      JSON.stringify({ error: "Gagal membuat promo", details: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}