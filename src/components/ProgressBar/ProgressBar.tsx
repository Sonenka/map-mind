'use client';

import styles from './ProgressBar.module.css';
import Link from 'next/link';

export default function ProgressBar({
  current,
  total
}: {
  current: number;
  total: number;
}) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={styles.progressWrapper}>
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar}
          style={{ width: `${percentage}%` }}
        />
        <span className={styles.progressText}>
          Вопрос {current} из {total} ({percentage}%)
        </span>
      </div>
      <Link
          href="/single"
          className={styles.progressLink}
        >
          ✕
      </Link>
    </div>
  );
}