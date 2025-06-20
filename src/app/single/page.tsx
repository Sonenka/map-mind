import styles from './styles.module.css';
import '../globals.css'
import MenuButton from '@/components/buttons/MenuButton/MenuButton'; // путь можно скорректировать при необходимости

export default function Singleplayer() {
  const quizTypes = [
    { id: 'capitals', name: 'Столицы' },
    { id: 'flags', name: 'Флаги' },
    { id: 'photos', name: 'Фото' },
    { id: 'map', name: 'Карта' },
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
            <MenuButton
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
            >
              {quiz.name}
            </MenuButton>
          ))}
        </div>

        <MenuButton
          href="/"
          variant='back'
        >
          ← Назад
        </MenuButton>
      </div>
    </div>
  );
}
