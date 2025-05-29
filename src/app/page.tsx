import Link from 'next/link';
import styles from './styles.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
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

      <div className={styles.content}>
        <h1 className={styles.title}>MapMind</h1>

        <div className={styles.menu}>
          <Link
            href="/singleplayer"
            className={`${styles.menuLink} ${styles.singleplayer}`}
          >
            Одиночная игра
          </Link>

          <button
            disabled
            className={`${styles.menuLink} ${styles.multiplayer}`}
          >
            Многопользовательская игра
          </button>

          <Link
            href="/ranking"
            className={`${styles.menuLink} ${styles.ranking}`}
          >
            Рейтинг
          </Link>
        </div>
      </div>
    </div>
  );
}