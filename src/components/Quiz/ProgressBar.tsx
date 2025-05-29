'use client';

import styles from './styles.module.css';

export default function ProgressBar({
  current,
  total
}: {
  current: number;
  total: number;
}) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={styles.progressContainer}>
      <div 
        className={styles.progressBar}
        style={{ width: `${percentage}%` }}
      />
      <span className={styles.progressText}>
        Вопрос {current} из {total} ({percentage}%)
      </span>
    </div>
  );
}