import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.question.findMany();
    const data = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options.split(';'),
      correct: q.correct,
    }));
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка при получении вопросов' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const data = {
      id: body.id,
      question: body.question,
      options: body.options.join(';'),
      correct: body.correct,
    };

    await prisma.question.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка при сохранении вопроса' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id не указан' }, { status: 400 });
  }

  try {
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка при удалении вопроса' }, { status: 500 });
  }
}
