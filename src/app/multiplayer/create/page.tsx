"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function CreateRoomPage() {
  const router = useRouter();

  const handleCreateRoom = () => {
    const roomId = uuidv4(); // случайный ID комнаты
    router.push(`/multiplayer/${roomId}`);
  };

  return (
    <div>
      <h1>Создать комнату</h1>
      <button onClick={handleCreateRoom}>Создать и пригласить</button>
    </div>
  );
}
