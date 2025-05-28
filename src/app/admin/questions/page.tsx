'use client';

import { useEffect, useState } from 'react';
import { QuestionModal } from './_components/question-modal';
import { QuestionsTable, Question } from './_components/questions-table';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const fetchQuestions = async () => {
    const res = await fetch('/api/questions');
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/questions?id=${id}`, { method: 'DELETE' });
    fetchQuestions();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Вопросы</h1>
      <button
        onClick={() => {
          setSelectedQuestion(null);
          setShowModal(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Добавить вопрос
      </button>

      <QuestionsTable
        questions={questions}
        onEdit={(q) => {
          setSelectedQuestion(q);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      {showModal && (
        <QuestionModal
          question={selectedQuestion}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchQuestions();
          }}
        />
      )}
    </div>
  );
}
