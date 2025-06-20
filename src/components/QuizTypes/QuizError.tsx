import Link from 'next/link';
import styles from './styles.module.css';

type Props = {
  message: string;
};

export default function QuizError({ message }: Props) {
  return (
    <div className={styles.answerContainer}>
      <h2>Ошибка</h2>
      <p>{message}</p>
      <Link href="/" className={styles.homeLink}>На главную</Link>
    </div>
  );
}