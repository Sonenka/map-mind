'use client';

import { useEffect, useState } from "react";

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
    <div style={{ padding: '2rem' }}>
      <h1>🏆 Топ игроков</h1>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {index + 1}. {player.name} — {player.totalScore} очков
          </li>
        ))}
      </ul>
    </div>
  );
}
