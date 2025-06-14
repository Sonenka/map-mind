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
    options: ['', '', '', ''] as string[], // Явно указываем тип string[]
    correct: question?.correct || '',
  });

  useEffect(() => {
    if (question) {
      // Безопасное преобразование options в массив
      const optionsArray = typeof question.options === 'string' 
        ? question.options.split(';') 
        : Array.isArray(question.options) 
          ? question.options 
          : [];
      
      // Заполняем массив до 4 элементов пустыми строками
      const filledOptions = [...optionsArray.slice(0, 4)];
      while (filledOptions.length < 4) {
        filledOptions.push('');
      }
      
      setForm({
        id: question.id,
        type: question.type,
        question: question.question,
        options: filledOptions,
        correct: question.correct,
      });
    }
  }, [question]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async () => {
    // Проверяем, что все варианты заполнены
    if (form.options.some(opt => !opt.trim())) {
      alert('Пожалуйста, заполните все варианты ответа');
      return;
    }

    // Проверяем, что правильный ответ выбран из вариантов
    if (!form.options.includes(form.correct)) {
      alert('Правильный ответ должен совпадать с одним из вариантов');
      return;
    }

    const payload = {
      ...form,
      options: form.options.join(';'), // Объединяем в строку для сохранения
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
          <label className="block mb-1">Варианты ответов</label>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={form.options[index] || ''}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full border p-2 rounded"
                placeholder={`Вариант ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Правильный ответ</label>
          <select
            value={form.correct}
            onChange={(e) => setForm({ ...form, correct: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="">Выберите правильный ответ</option>
            {form.options
              .filter(opt => opt.trim())
              .map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Отмена</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Сохранить</button>
        </div>
      </div>
    </div>
  );
}