import '../globals.css'
import styles from './page.module.css';
import MenuButton from '@/components/buttons/MenuButton/MenuButton';
import BackgroundVideo from '@/components/BackgroundVideo/backgroundVideo';

export default function Singleplayer() {
  const quizTypes = [
    { id: 'capitals', name: 'Столицы' },
    { id: 'flags', name: 'Флаги' },
    { id: 'photos', name: 'Фото' },
    { id: 'map', name: 'Карта' },
  ];

  return (
    <div>
      <BackgroundVideo />

      <div className={styles.overlay} />

      <div className={styles.container}>
        <h2 className={styles.title}>Выбери тип квиза</h2>

        <div className={styles.quizGrid}>
          {quizTypes.map((quiz) => (
            <MenuButton key={quiz.id} href={`/quiz/${quiz.id}`}>
              {quiz.name}
            </MenuButton>
          ))}
        </div>

        <MenuButton variant='back'>
          Назад
        </MenuButton>
      </div>
    </div>
  );
}
