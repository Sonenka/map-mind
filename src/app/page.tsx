'use client';

import styles from './page.module.css';

export default function Home() {
  const quizTypes = [
    { id: 'capitals', name: 'столицы' },
    { id: 'flags', name: 'флаги' },
    { id: 'photos', name: 'фото' },
    { id: 'contours', name: 'контур' },
    { id: 'multiplayer', name: 'мультиплеер' },
    { id: 'secret', name: 'секрет' }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>MapMind</h1>
      
      <div className={styles.quizGrid}>
        {quizTypes.map((quiz) => (
          <button 
            key={quiz.id}
            className={styles.quizButton}
            onClick={() => console.log('Selected:', quiz.id)}
          >
            {quiz.name}
          </button>
        ))}
      </div>

      <button className={styles.ratingButton}>
        Рейтинг
      </button>
    </div>
  );
}