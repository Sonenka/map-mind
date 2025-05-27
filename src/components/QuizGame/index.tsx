//src/components/Quiz/index.tsx
'use client';
import { useEffect, useState } from 'react';
import { QUESTIONS } from '@/lib/questions';
import Question from './Question';
import ProgressBar from './ProgressBar';
import Link from 'next/link';
import styles from './styles.module.css';

type QuestionType = {
  id: string;
  question?: string;
  image?: string;
  options: string[];
  correct: string;
};

export default function QuizGame({ quizType }: { quizType: string }) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'loading'|'ready'|'error'>('loading');
  const [error, setError] = useState<string>('');

  // Загрузка вопросов
  useEffect(() => {
    setStatus('loading');
    
    try {
      // 1. Проверка наличия quizType
      if (!quizType || typeof quizType !== 'string') {
        throw new Error('Тип викторины не передан');
      }

      // 2. Нормализация параметра
      const normalizedType = quizType.trim().toLowerCase();
      console.log('Загружаем викторину:', normalizedType);

      // 3. Проверка существования викторины
      if (!(normalizedType in QUESTIONS)) {
        throw new Error(`Викторина "${quizType}" не найдена`);
      }

      // 4. Проверка наличия вопросов
      const loadedQuestions = QUESTIONS[normalizedType as keyof typeof QUESTIONS];
      if (!loadedQuestions?.length) {
        throw new Error(`Нет вопросов для викторины "${quizType}"`);
      }

      setQuestions(loadedQuestions);
      setStatus('ready');
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setStatus('error');
    }
  }, [quizType]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(score + 1);
    setCurrentIndex(currentIndex + 1);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
  };

  // Состояние загрузки
  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <h3>Загрузка викторины...</h3>
          <p>Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  // Обработка ошибок
  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Произошла ошибка</h2>
          <p>{error}</p>
          <p>Доступные викторины: {Object.keys(QUESTIONS).join(', ')}</p>
          <Link href="/" className={styles.homeLink}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  // Завершение квиза
  if (currentIndex >= questions.length) {
    return (
      <div className={styles.container}>
        <div className={styles.result}>
          <h2>Викторина завершена!</h2>
          <p className={styles.score}>
            Правильных ответов: {score} из {questions.length}
          </p>
          <div className={styles.actions}>
            <button 
              onClick={restartQuiz} 
              className={styles.button}
            >
              Пройти ещё раз
            </button>
            <Link 
              href="/" 
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              На главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Основной игровой экран
  return (
    <div className={styles.container}>
      <ProgressBar 
        current={currentIndex + 1} 
        total={questions.length} 
      />
      
      <Question 
        data={questions[currentIndex]} 
        onAnswer={handleAnswer} 
      />
    </div>
  );
}