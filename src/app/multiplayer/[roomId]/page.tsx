"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/lib/useSocket";
import { useParams } from "next/navigation";

export default function RoomPage() {
  const socket = useSocket();
  const { roomId } = useParams();

  const [players, setPlayers] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ playerId: string; answer: string }[]>([]);
  const [question, setQuestion] = useState("Столица Франции?");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!socket || typeof roomId !== "string") return;

    socket.emit("join", roomId, (response: { success: boolean; message: string }) => {
      if (!response.success) {
        setError(response.message);
      } else {
        setError("");
      }
    });

    socket.on("player-joined", (playersInRoom) => {
      if (Array.isArray(playersInRoom)) {
        setPlayers(playersInRoom);
      } else if (playersInRoom && typeof playersInRoom === "object") {
        setPlayers(Object.values(playersInRoom));
      } else {
        setPlayers([]);
      }
    });

    socket.on("answer", (data) => {
      setAnswers((prev) => [...prev, data]);
    });

    return () => {
      socket.off("player-joined");
      socket.off("answer");
    };
  }, [socket, roomId]);

  const sendAnswer = (answer: string) => {
    if (!roomId || typeof roomId !== "string") return;
    socket?.emit("answer", { roomId, answer });
  };

  return (
    <div>
      <h1>Комната: {roomId}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Подключено игроков: {players.length} / 2</h3>
      <ul>
        {players.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      {players.length < 2 ? (
        <p>Ожидание второго игрока...</p>
      ) : (
        <>
          <h3>Вопрос: {question}</h3>
          <button onClick={() => sendAnswer("Париж")}>Париж</button>
          <button onClick={() => sendAnswer("Берлин")}>Берлин</button>
          <button onClick={() => sendAnswer("Лондон")}>Лондон</button>

          <h3>Ответы:</h3>
          <ul>
            {answers.map((a, i) => (
              <li key={i}>
                Игрок {a.playerId} ответил: {a.answer}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
