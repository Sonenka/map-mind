'use client';

import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles.module.css';

export default function CreateRoomPage() {
  const router = useRouter();

  const handleCreateRoom = () => {
    const roomId = uuidv4(); // случайный ID комнаты
    router.push(`/multiplayer/${roomId}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Создать комнату</h1>
      <button className={styles.button} onClick={handleCreateRoom}>
        Создать и пригласить
      </button>
    </div>
  );
}
