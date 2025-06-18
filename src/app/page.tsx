'use client';

import styles from './styles.module.css';
import MenuButton from '@/components/MenuButton/MenuButton';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

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
        {/* Добавляем кнопку профиля в правый верхний угол */}
        <div className={styles.profileButtonContainer}>
          <Link href="/auth/profile" className={styles.profileButton}>
            {session ? (
              <span className={styles.profileIcon}>👤</span>
            ) : (
              <span className={styles.profileIcon}>🔒</span>
            )}
          </Link>
        </div>

        <h1 className={styles.title}>MapMind</h1>

        <div className={styles.menu}>
          <MenuButton href="/single">
            Одиночная игра
          </MenuButton>

          <MenuButton href="/multiplayer/create">
            Многопользовательская игра
          </MenuButton>

          <MenuButton href="/leaderboard">
            Рейтинг
          </MenuButton>
        </div>
      </div>
    </div>
  );
}