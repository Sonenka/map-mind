import styles from './styles.module.css';

export default function QuizLoader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loaderContainer}>
        <p>Загрузка...</p>
      </div>
    </div>
  );
}