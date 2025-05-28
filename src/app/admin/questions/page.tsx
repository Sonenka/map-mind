'use client';

import { useEffect, useState } from 'react';
import { QuestionModal } from './_components/question-modal';
import { QuestionsTable, Question } from './_components/questions-table';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [type] = useState('capitals'); // пример типа

  const fetchQuestions = async () => {
    const res = await fetch(`/api/questions/${type}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setQuestions(data);
    } else {
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [type]);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить вопрос?')) return;

    const res = await fetch(`/api/questions/${type}?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchQuestions();
    } else {
      alert('Ошибка удаления вопроса');
    }
  };

  const handleSave = async (question: Question) => {
    const method = questions.some(q => q.id === question.id) ? 'PUT' : 'POST';

    const res = await fetch(`/api/questions/${type}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });

    if (res.ok) {
      setShowModal(false);
      fetchQuestions();
    } else {
      alert('Ошибка сохранения вопроса');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Вопросы: {type}</h1>
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
          onSave={handleSave}
        />
      )}
    </div>
  );
}
