'use client';
import { useEffect, useState } from 'react';
import { QuestionModal } from './_components/question-modal';
import { QuestionsTable, Question } from './_components/questions-table';

export default function QuestionsPage() {
  const [type, setType] = useState('capitals');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchQuestions = async () => {
    const res = await fetch(`/api/questions/${type}`);
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, [type]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Вопросы: {type}</h1>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="mb-4 border p-2 rounded"
      >
        <option value="capitals">Столицы</option>
        <option value="flags">Флаги</option>
        <option value="photos">Фото</option>
        <option value="contours">Контуры</option>
      </select>

      <button onClick={() => { setSelectedQuestion(null); setShowModal(true); }} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        Добавить вопрос
      </button>

      <QuestionsTable
        questions={questions}
        onEdit={(q) => { setSelectedQuestion(q); setShowModal(true); }}
        onDelete={async (id) => {
          await fetch(`/api/questions/${type}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });
          fetchQuestions();
        }}
      />

      {showModal && (
        <QuestionModal
          question={selectedQuestion}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchQuestions();
          }}
          type={type}
        />
      )}
    </div>
  );
}
