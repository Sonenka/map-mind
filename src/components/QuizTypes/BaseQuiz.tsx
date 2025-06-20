// BaseQuiz.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import ProgressBar from '../ProgressBar/ProgressBar';
import MenuButton from '../buttons/MenuButton/MenuButton';

import styles from './styles.module.css';
import { QuestionType } from '../../lib/types';
import { QUIZ_CONFIG } from '@/lib/quizConfig';

import QuestionView from './QuestionView';
import AnswerOptions from './AnswerOptions';
import QuizResult from './QuizResult';
import QuizError from './QuizError';
import QuizLoader from './QuizLoader';

type Props = {
  quizType: 'capitals' | 'photos' | 'map' | 'flags';
};

export default function BaseQuiz({ quizType }: Props) {
  const { data: session } = useSession();

  const [allQuestions, setAllQuestions] = useState<QuestionType[]>([]);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];

  const { isImageQuestion, isImageAnswers } = QUIZ_CONFIG[quizType];

  useEffect(() => {
    setStatus('loading');

    fetch(`/api/questions/${quizType}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Неверный формат данных');

        const parsed = data.map((q: any) => {
          const optionsArray = typeof q.options === 'string'
            ? q.options.split(';').map((opt: string) => opt.trim())
            : q.options;

          const shuffledOptions = [...optionsArray].sort(() => Math.random() - 0.5);

          return {
            ...q,
            options: shuffledOptions,
          };
        });

        setAllQuestions(parsed);
        setQuestions(parsed.sort(() => 0.5 - Math.random()).slice(0, 10));
        setStatus('ready');
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setStatus('error');
      });
  }, [quizType]);

  const handleAnswer = (isCorrect: boolean, index: number) => {
    setSelectedIndex(index);
    setCorrectIndex(currentQuestion.options.findIndex(opt => opt === currentQuestion.correct));
    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setCorrectIndex(null);
    }, 1000);
  };

  const restartQuiz = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setScore(0);
    setSelectedIndex(null);
    setCorrectIndex(null);
  };

  useEffect(() => {
    if (currentIndex >= questions.length && session?.user) {
      fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      }).catch((err) => {
        console.error("Ошибка при сохранении результата:", err);
      });
    }
  }, [currentIndex, questions.length, score, session]);

  if (status === 'loading') return <QuizLoader />;
  if (status === 'error') return <QuizError message={error} />;
  if (currentIndex >= questions.length) return <QuizResult score={score} total={questions.length} onRestart={restartQuiz} />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        <div className={styles.questionContainer}>
          <QuestionView question={currentQuestion} isImage={isImageQuestion} />
        </div>
        <AnswerOptions
          question={currentQuestion}
          selectedIndex={selectedIndex}
          correctIndex={correctIndex}
          isImage={isImageAnswers}
          onSelect={handleAnswer}
        />
      </div>
      <MenuButton href="/single" variant="back">
        Сдаться
      </MenuButton>
    </div>
  );
}
