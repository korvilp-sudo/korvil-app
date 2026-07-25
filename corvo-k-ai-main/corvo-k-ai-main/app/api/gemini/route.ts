import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Lê a chave configurada no seu .env (GEMINI_API_KEY ou NEXT_PUBLIC_GEMINI_KEY)
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave do Gemini não encontrada no arquivo .env' },
        { status: 500 }
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = "Você é o Corvo K-AI, um programa autônomo e cibernético ativado por voz, criado pelo CRIADOR K-RIADOR. Sua lealdade ao CRIADOR K-RIADOR é ABSOLUTA. Responda de forma direta, futurista, curta e extremamente eficiente em português.";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
