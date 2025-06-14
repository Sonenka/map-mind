'use client';

import { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';
import Link from 'next/link';
import OptionButton from '../OptionButton/OptionButton';  // импортируем новый компонент
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
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);

  useEffect(() => {
    setStatus('loading');
    fetch(`/api/questions/${quizType}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Неверный формат данных');
        const parsed = data.map((q) => ({
          ...q,
          options: typeof q.options === 'string'
            ? q.options.split(';').map((opt: string) => opt.trim())
            : q.options,
        }));
        setQuestions(parsed);
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
    setCurrentIndex(0);
    setScore(0);
    setSelectedIndex(null);
    setCorrectIndex(null);
  };

  if (status === 'loading') {
    return (
      <div className={styles.answerContainer}>
        <h3>Загрузка вопросов...</h3>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.answerContainer}>
        <h2>Ошибка</h2>
        <p>{error}</p>
        <Link href="/" className={styles.homeLink}>На главную</Link>
      </div>
    );
  }

  if (currentIndex >= questions.length) {
    return (
      <div className={styles.answerContainer}>
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
    <div className={styles.answerContainer}>
      <div className={styles.topContainer}>
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        <h2 className={styles.questionText}>{currentQuestion.question}</h2>
      </div>

      {isImageQuestion ? (
        <div className={styles.imageOptions}>
          {currentQuestion.options.map((url, index) => {
            let optionClass = styles.option;

            if (selectedIndex !== null) {
              if (index === correctIndex) {
                optionClass += ' ' + styles.correct;
              } else if (index === selectedIndex && index !== correctIndex) {
                optionClass += ' ' + styles.incorrect;
              }
            }

            return (
              <div
                key={index}
                className={optionClass}
                onClick={() => selectedIndex === null && handleAnswer(url === currentQuestion.correct, index)}
              >
                <img
                  src={url}
                  alt={`Флаг ${index + 1}`}
                  className={styles.flagImage}
                  onError={(e) => {
                    e.currentTarget.src = '/default-flag.png';
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.textOptions}>
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={index}
              disabled={selectedIndex !== null}
              isCorrect={index === correctIndex}
              isSelected={index === selectedIndex}
              onClick={() => selectedIndex === null && handleAnswer(option === currentQuestion.correct, index)}
            >
              {option}
            </OptionButton>
          ))}
        </div>
      )}
    </div>
  );
}
