import MenuButton from '../buttons/MenuButton/MenuButton';
import styles from './styles.module.css';

type Props = {
  score: number;
  total: number;
  onRestart: () => void;
};

export default function QuizResult({ score, total, onRestart }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2>Викторина завершена!</h2>
        <h2>Результат: {score} из {total}</h2>

        <MenuButton onClick={onRestart}>
          Сыграть ещё раз
        </MenuButton>

        <MenuButton href="/" variant="onMain">
          На главную
        </MenuButton>
      </div>
    </div>
  );
}