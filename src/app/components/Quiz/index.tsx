// src/components/Quiz/index.tsx
'use client';
import { useEffect, useState } from 'react';
import Question from './Question';
import ProgressBar from './ProgressBar';
import Link from 'next/link';
import styles from './styles.module.css';

type QuestionType = {
  id: string;
  question: string;
  options: string[];
  correct: string;
};

export default function QuizGame({ quizType }: { quizType: string }) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'loading'|'ready'|'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setStatus('loading');

    fetch(`/api/questions/${quizType}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Неверный формат данных');
        setQuestions(data);
        setStatus('ready');
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setStatus('error');
      });
  }, [quizType]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
  };

  // Загрузка
  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <h3>Загрузка вопросов...</h3>
      </div>
    );
  }

  // Ошибка
  if (status === 'error') {
    return (
      <div className={styles.container}>
        <h2>Ошибка</h2>
        <p>{error}</p>
        <Link href="/" className={styles.homeLink}>На главную</Link>
      </div>
    );
  }

  // Завершение
  if (currentIndex >= questions.length) {
    return (
      <div className={styles.container}>
        <h2>Викторина завершена!</h2>
        <p>Ваш результат: {score} из {questions.length}</p>
        <button onClick={restartQuiz} className={styles.button}>Пройти ещё раз</button>
        <Link href="/" className={styles.secondaryButton}>На главную</Link>
      </div>
    );
  }

  // Игровой экран
  return (
    <div className={styles.container}>
      <ProgressBar current={currentIndex + 1} total={questions.length} />
      <Question data={questions[currentIndex]} onAnswer={handleAnswer} />
    </div>
  );
}
