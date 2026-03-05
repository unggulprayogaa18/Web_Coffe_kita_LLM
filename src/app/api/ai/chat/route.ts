import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const userMessage = messages[messages.length - 1].content;

    // 1. Ambil data pelanggan terbaru sebagai konteks AI
    const customers = await db.customer.findMany();
    const customerContext = customers.map(c => 
      `- ${c.name}: Minuman favorit ${c.favoriteDrink}, Minat: ${c.interests.join(', ')}`
    ).join('\n');

    // 2. Panggil AI Groq dengan data pelanggan
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `Anda adalah asisten cerdas Kopi Kita. 
      Tugas Anda adalah membantu Mimi (pemilik toko) menjawab pertanyaan berdasarkan data pelanggan berikut:
      
      ${customerContext}
      
      Jawablah dengan ramah, singkat, dan informatif. Jika data tidak ditemukan, sampaikan dengan sopan.`,
      prompt: userMessage,
    });

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Gagal memproses pesan" }), { status: 500 });
  }
}