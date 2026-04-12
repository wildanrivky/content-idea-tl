import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY tidak ditemukan di konfigurasi server.' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 4096,
    });

    const text = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Error generating with OpenAI:', error);
    return NextResponse.json({ error: error.message || 'Gagal menghasilkan konten dari AI.' }, { status: 500 });
  }
}
