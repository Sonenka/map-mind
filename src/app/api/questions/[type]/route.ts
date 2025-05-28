import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { Question } from '@/app/admin/questions/_components/questions-table';

export async function GET(request: Request, { params }: { params: { type: string } }) {
  const { type } = params;

  try {
    const filePath = path.join(process.cwd(), 'data', `${type}.csv`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const questions = records.map((record: any) => ({
      id: record.id,
      question: record.question,
      options: record.options.split(';'),
      correct: record.correct,
    }));

    return NextResponse.json(questions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка при чтении файла' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { type: string } }) {
  const { type } = params;
  const body = await request.json();

  try {
    const filePath = path.join(process.cwd(), 'data', `${type}.csv`);
    let questions = [];

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      questions = parse(content, { columns: true, skip_empty_lines: true });
    }

    const updated = questions.filter((q: Question) => q.id !== body.id);
    updated.push({
      id: body.id,
      question: body.question,
      options: body.options.join(';'),
      correct: body.correct,
    });

    const csv = stringify(updated, {
      header: true,
      columns: ['id', 'question', 'options', 'correct'],
    });

    fs.writeFileSync(filePath, csv);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка записи файла' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { type: string } }) {
  const { type } = params;
  const body = await request.json();

  try {
    const filePath = path.join(process.cwd(), 'data', `${type}.csv`);
    let questions: Question[] = [];

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      questions = parse(content, { columns: true, skip_empty_lines: true }) as Question[];
    }

    // Обновляем вопрос
    const updated = questions.map(q =>
      q.id === body.id
        ? {
            id: body.id,
            question: body.question,
            options: body.options.join(';'),
            correct: body.correct,
          }
        : q
    );

    const csv = stringify(updated, {
      header: true,
      columns: ['id', 'question', 'options', 'correct'],
    });

    fs.writeFileSync(filePath, csv);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка обновления файла' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { type: string } }) {
  const { type } = params;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID не передан' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', `${type}.csv`);
    let questions: Question[] = [];

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      questions = parse(content, { columns: true, skip_empty_lines: true }) as Question[];
    }

    // Удаляем вопрос по id
    const filtered = questions.filter(q => q.id !== id);

    const csv = stringify(filtered, {
      header: true,
      columns: ['id', 'question', 'options', 'correct'],
    });

    fs.writeFileSync(filePath, csv);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Ошибка удаления вопроса' }, { status: 500 });
  }
}