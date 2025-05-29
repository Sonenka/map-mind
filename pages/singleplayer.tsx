import Link from 'next/link';
import styles from './styles.module.css';

export default function Singleplayer() {
  const quizTypes = [
    { id: 'capitals', name: 'Столицы' },
    { id: 'flags', name: 'Флаги' },
    { id: 'photos', name: 'Фото' },
    { id: 'contours', name: 'Контур' },
  ];

  return (
    <div>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoBackground}
      >
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.overlay} />

      <div className={styles.container}>
        <h2 className={styles.title}>Выбери тип квиза</h2>

        <div className={styles.quizGrid}>
          {quizTypes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className={styles.quizLink}
            >
              {quiz.name}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className={styles.backLink}
        >
          ← Назад
        </Link>
      </div>
    </div>
  );
}