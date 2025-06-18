'use client';

import { useEffect, useState } from "react";
import styles from './leaderboard.module.css';
import MenuButton from "@/components/MenuButton/MenuButton";

type Player = {
  name: string;
  totalScore: number;
};

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(setPlayers);
  }, []);

  return (
    <div className={styles.container}>
      <MenuButton
        href="/"
        variant='back'
      >
        ← Назад
      </MenuButton>
      <h1 className={styles.title}>🏆 Топ игроков</h1>
      <ul className={styles.list}>
        {players.map((player, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.rank}>#{index + 1}</span>
            <span className={styles.name}>{player.name}</span>
            <span className={styles.score}>{player.totalScore} очков</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
