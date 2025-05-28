'use client';

import { useState, useEffect } from 'react';
import { Question } from './questions-table';

type Props = {
  question: Question | null;
  onClose: () => void;
  onSaved: () => void;
  type: string; 
};

export function QuestionModal({ question, onClose, onSaved, type }: Props) {
    const [form, setForm] = useState({
    id: question?.id || crypto.randomUUID(),
    type: question?.type || type,
    question: question?.question || '', 
    options: Array.isArray(question?.options) ? question.options.join(';') : question?.options || '',
    correct: question?.correct || '',
  });

  useEffect(() => {
    if (question) {
      setForm({
        id: question.id,
        type: question.type,
        question: question.question,
        options: Array.isArray(question.options) ? question.options.join(';') : question.options || '',
        correct: question.correct,
      });
    }
  }, [question]);

  const handleSubmit = async () => {
    const payload = {
      ...form,
      options: form.options,
    };

    const res = await fetch(`/api/questions/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onSaved();
    } else {
      alert('Ошибка при сохранении вопроса');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {question ? 'Редактировать вопрос' : 'Добавить вопрос'}
        </h2>

        <div className="mb-2">
          <label className="block mb-1">Тип</label>
          <input
            type="text"
            value={form.type}
            disabled
            className="w-full border p-2 rounded bg-gray-100 text-gray-600"
          />
        </div>

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
          <button onClick={onClose} className="px-4 py-2 border rounded">Отмена</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Сохранить</button>
        </div>
      </div>
    </div>
  );
}
