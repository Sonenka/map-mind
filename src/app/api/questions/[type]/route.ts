import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.pathname.split('/').pop();

  try {
    const questions = await prisma.question.findMany({
      where: { type },
    });

    const parsed = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? q.options.split(';').map(opt => opt.trim()) : q.options,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка получения вопросов' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.pathname.split('/').pop();

  const data = await request.json();

  try {
    await prisma.question.upsert({
      where: { id: data.id },
      update: {
        question: data.question,
        options: Array.isArray(data.options) ? data.options.join(';') : data.options,
        correct: data.correct,
        type,
      },
      create: {
        id: data.id,
        question: data.question,
        options: Array.isArray(data.options) ? data.options.join(';') : data.options,
        correct: data.correct,
        type,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Ошибка при сохранении вопроса:', error);
    return NextResponse.json({ error: 'Ошибка сохранения', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    await prisma.question.delete({
      where: { id: data.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
