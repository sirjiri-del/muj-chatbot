import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Vercel spustí tuto funkci při požadavku POST na /api/chat
export async function POST(request) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Do požadavku dej prosím text v poli message" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Zavoláme Responses API
    const ai = await client.responses.create({
      model: "gpt-4o",
      instructions: "Buď užitečný asistent, odpovídej česky a srozumitelně.",
      input: message
    });

    const reply = ai.output_text ?? "Nemám odpověď";

    return new Response(JSON.stringify({ reply }), {
      headers: { "content-type": "application/json" }
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Na serveru došlo k chybě" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

// Jednoduchý test přes GET na /api/chat
export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" }
  });
}
