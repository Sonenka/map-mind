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
      // console.log(quizType);
    fetch(`/api/questions/${quizType}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Неверный формат данных');

        const parsed = data.map((q) => ({
          ...q,
          options: typeof q.options === 'string' ? q.options.split(';').map((opt: string) => opt.trim()) : q.options,
        }));
        console.log(parsed[1].options[0]);
        setQuestions(parsed);
        setStatus('ready');
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setStatus('error');
      });
  }, [quizType]);

  // console.log(2);
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
  };

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <h3>Загрузка вопросов...</h3>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <h2>Ошибка</h2>
        <p>{error}</p>
        <Link href="/" className={styles.homeLink}>На главную</Link>
      </div>
    );
  }

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
  const currentQuestion = questions[currentIndex];
  const isImageQuestion = currentQuestion.options[0]?.startsWith('http');
  return (
    <div className={styles.container}>
      <ProgressBar current={currentIndex + 1} total={questions.length} />
      
      <h2 className={styles.questionText}>{currentQuestion.question}</h2>

      {isImageQuestion ? (
        <div className={styles.imageOptions}>
          {currentQuestion.options.map((url, index) => (
            <div 
              key={index}
              className={styles.option}
              onClick={() => handleAnswer(url === currentQuestion.correct)}
            >
              <img
                src={url}
                alt={`Флаг ${index + 1}`}
                className={styles.flagImage}
                onError={(e) => {
                  e.currentTarget.src = '/default-flag.png'; // Фолбек изображение
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.textOptions}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={styles.option}
              onClick={() => handleAnswer(option === currentQuestion.correct)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
