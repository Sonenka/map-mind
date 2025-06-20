'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './leaderboard.module.css';
import MenuButton from '@/components/buttons/MenuButton/MenuButton';

type Player = {
  name: string;
  totalScore: number;
};

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const currentUserName = session?.user?.name;

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(setPlayers);
  }, []);

  const topPlayers = players.slice(0, 5);
  const userIndex = players.findIndex(p => p.name === currentUserName);
  const userIsInTop = userIndex >= 0 && userIndex < 5;
  const currentUser = !userIsInTop && userIndex >= 0 ? players[userIndex] : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🏆 Топ игроков</h1>

      <ul className={styles.list}>
        {topPlayers.map((player, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.rank}>#{index + 1}</span>
            <span className={styles.name}>{player.name}</span>
            <span className={styles.score}>{player.totalScore} очков</span>
          </li>
        ))}
      </ul>

      {currentUser && (
        <div className={styles.currentUserWrapper}>
          <li className={`${styles.item} ${styles.currentUser}`}>
            <span className={styles.rank}>#{userIndex + 1}</span>
            <span className={styles.name}>{currentUser.name}</span>
            <span className={styles.score}>{currentUser.totalScore} очков</span>
          </li>
        </div>
      )}

      <MenuButton href="/" variant="back">
        Назад
      </MenuButton>
    </div>
  );
}
