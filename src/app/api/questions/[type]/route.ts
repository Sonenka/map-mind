import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { type: string } }) {
  const { type } = params;

  try {
    const questions = await prisma.question.findMany({
      where: { type },
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка получения вопросов' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { type: string } }) {
  const { type } = params;
  const data = await request.json();

  try {

    const result = await prisma.question.upsert({
      where: { id: data.id },
      update: {
        question: data.question,
        options: data.options,
        correct: data.correct,
        type: data.type, 
      },
      create: {
        id: data.id,
        question: data.question,
        options: data.options,
        correct: data.correct,
        type: data.type, // обязательно!
      },
    });


    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Ошибка сохранения', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { type: string } }) {
  const { type } = params;
  const { id } = await request.json();

  try {
    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
