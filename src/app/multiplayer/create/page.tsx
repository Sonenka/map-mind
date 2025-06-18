'use client';

import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles.module.css';
import { useState } from 'react';

export default function CreateRoomPage() {
  const router = useRouter();
  const [quizType, setQuizType] = useState("flags");

  const handleCreateRoom = () => {
    const roomId = uuidv4();
    router.push(`/multiplayer/${roomId}?quizType=${quizType}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Создать комнату</h1>

      <label className={styles.label}>Тип викторины:</label>
      <select
        value={quizType}
        onChange={(e) => setQuizType(e.target.value)}
        className={styles.select}
      >
        <option value="flags">Флаги</option>
        <option value="capitals">Столицы</option>
        <option value="photos">Фото</option>
        <option value="map">Карта</option>
      </select>

      <button className={styles.button} onClick={handleCreateRoom}>
        Создать и пригласить
      </button>
    </div>
  );
}
