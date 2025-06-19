'use client';

import { useState, useEffect } from 'react';
import { Question } from './questions-table';
import styles from './QuestionModal.module.css';

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
    options: ['', '', '', ''] as string[],
    correct: question?.correct || '',
  });

  useEffect(() => {
    if (question) {
      const optionsArray =
        typeof question.options === 'string'
          ? (question.options as string).split(';')
          : Array.isArray(question.options)
          ? question.options
          : [];

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
    if (form.options.some((opt) => !opt.trim())) {
      alert('Пожалуйста, заполните все варианты ответа');
      return;
    }

    if (!form.options.includes(form.correct)) {
      alert('Правильный ответ должен совпадать с одним из вариантов');
      return;
    }

    const payload = {
      ...form,
      options: form.options.join(';'),
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {question ? 'Редактировать вопрос' : 'Добавить вопрос'}
        </h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Тип</label>
          <input
            type="text"
            value={form.type}
            disabled
            className={`${styles.input} ${styles.disabledInput}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Вопрос</label>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Варианты ответов</label>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className={styles.formGroup}>
              <input
                type="text"
                value={form.options[index] || ''}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className={styles.input}
                placeholder={`Вариант ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Правильный ответ</label>
          <select
            value={form.correct}
            onChange={(e) => setForm({ ...form, correct: e.target.value })}
            className={styles.input}
          >
            <option value="">Выберите правильный ответ</option>
            {form.options
              .filter((opt) => opt.trim())
              .map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelButton}>
            Отмена
          </button>
          <button onClick={handleSubmit} className={styles.saveButton}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
