import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

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
