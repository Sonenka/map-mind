import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), 'data', 'questions.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const record of records) {
    await prisma.question.create({
      data: {
        id: record.id,
        type: record.type,
        question: record.question,
        options: record.options, 
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
