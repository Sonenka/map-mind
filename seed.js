import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), 'data', 'capitals.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // records — массив объектов с полями: id, question, options, correct и т.п.

  for (const record of records) {
    await prisma.question.create({
      data: {
        id: record.id,
        question: record.question,
        options: record.options, // если нужно — сохраняй как строку с ; или как JSON.stringify
        correct: record.correct,
      },
    });
  }

  console.log('Данные импортированы в базу');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
