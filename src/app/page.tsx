import styles from './styles.module.css';
import btnStyles from '../components/MenuButton/MenuButton.module.css';
import MenuButton from '@/components/MenuButton/MenuButton'; // или укажи относительный путь

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
          <MenuButton
            href="/single"
          >
            Одиночная игра
          </MenuButton>

          <MenuButton
            variant="disabled"
          >
            Многопользовательская игра
          </MenuButton>

          <MenuButton
            href="/rating"
          >
            Рейтинг
          </MenuButton>
        </div>
      </div>
    </div>
  );
}
