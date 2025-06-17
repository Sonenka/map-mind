"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/lib/useSocket";

export default function MultiplayerPage() {
  const socket = useSocket();

  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ playerId: string; answer: string }[]>([]);
  const [question, setQuestion] = useState("Столица Франции?");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit(
      "join",
      roomId,
      (response: { success: boolean; message: string }) => {
        if (!response.success) {
          setError(response.message);
        } else {
          setError("");
        }
      }
    );

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

  const handleJoinRoom = () => {
    if (roomIdInput.trim() === "") {
      setError("Введите номер комнаты");
      return;
    }
    setRoomId(roomIdInput.trim());
    setAnswers([]);
    setPlayers([]);
  };

  const sendAnswer = (answer: string) => {
    if (!roomId) return;
    socket?.emit("answer", { roomId, answer });
  };

  if (!roomId) {
    return (
      <div>
        <h1>Вход в комнату мультиплеера</h1>
        <input
          type="text"
          placeholder="Введите номер комнаты"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Войти</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h1>Мультиплеерная игра</h1>
      <h2>Комната: {roomId}</h2>
      <h3>Вопрос: {question}</h3>

      <div>
        <button onClick={() => sendAnswer("Париж")}>Париж</button>
        <button onClick={() => sendAnswer("Лондон")}>Лондон</button>
        <button onClick={() => sendAnswer("Берлин")}>Берлин</button>
      </div>

      <h3>Игроки в комнате (максимум 2):</h3>
      <ul>
        {(Array.isArray(players) ? players : []).map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <h3>Ответы:</h3>
      <ul>
        {answers.map((a, i) => (
          <li key={i}>
            Игрок {a.playerId} ответил: {a.answer}
          </li>
        ))}
      </ul>

      {players.length < 2 && <p>Ожидание второго игрока...</p>}
    </div>
  );
}
