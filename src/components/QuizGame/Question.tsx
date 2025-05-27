'use client';

import { useState } from 'react';
import { QuestionType } from '../../lib/types';
import styles from './styles.module.css';

export default function Question({
  data,
  onAnswer
}: {
  data: QuestionType;
  onAnswer: (isCorrect: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (option: string) => {
    if (selected) return; // блокируем повторный выбор

    setSelected(option);
    const isCorrect = option === data.correct;

    // Пауза перед переходом к следующему вопросу
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null); // сбрасываем состояние
    }, 1000);
  };

  return (
    <div className={styles.questionContainer}>
      {data.image && (
        <img 
          src={data.image} 
          alt="Question" 
          className={styles.questionImage}
        />
      )}
      {data.question && (
        <h3 className={styles.questionText}>{data.question}</h3>
      )}

      <div className={styles.optionsGrid}>
        {data.options.map((option) => {
          let btnClass = styles.optionButton;

          if (selected) {
            if (option === data.correct) {
              btnClass += ' ' + styles.correct;
            } else if (option === selected) {
              btnClass += ' ' + styles.incorrect;
            } else {
              btnClass += ' ' + styles.disabled;
            }
          }

          return (
            <button
              key={option}
              className={btnClass}
              onClick={() => handleClick(option)}
              disabled={!!selected}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
