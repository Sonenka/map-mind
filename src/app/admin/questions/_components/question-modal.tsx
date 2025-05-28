'use client';

import { useState, useEffect } from 'react';
import { Question } from './questions-table';

type Props = {
  question: Question | null;
  onClose: () => void;
  onSave: (question: Question) => void;
};

export function QuestionModal({ question, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    id: question?.id || crypto.randomUUID(),
    question: question?.question || '',
    options: question?.options.join(';') || '',
    correct: question?.correct || '',
  });

  useEffect(() => {
    setForm({
      id: question?.id || crypto.randomUUID(),
      question: question?.question || '',
      options: question?.options.join(';') || '',
      correct: question?.correct || '',
    });
  }, [question]);

  const handleSubmit = () => {
    onSave({
      id: form.id,
      question: form.question,
      options: form.options.split(';').map((opt) => opt.trim()),
      correct: form.correct,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {question ? 'Редактировать вопрос' : 'Добавить вопрос'}
        </h2>

        <div className="mb-2">
          <label className="block mb-1">Вопрос</label>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1">Варианты (через ;)</label>
          <input
            type="text"
            value={form.options}
            onChange={(e) => setForm({ ...form, options: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Правильный ответ</label>
          <input
            type="text"
            value={form.correct}
            onChange={(e) => setForm({ ...form, correct: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Отмена
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
