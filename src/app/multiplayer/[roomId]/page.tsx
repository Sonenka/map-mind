"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/lib/useSocket";
import { useParams } from "next/navigation";

type Question = {
  id: string;
  question: string;
  options: string[];
  correct: string;
};

export default function RoomPage() {
  const socket = useSocket();
  const { roomId } = useParams();
  const [quizType, setQuizType] = useState("flags"); // или другой тип викторины

  const [players, setPlayers] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ 
    playerId: string; 
    answer: string;
    isCorrect: boolean;
  }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Загрузка вопросов при монтировании
  useEffect(() => {
    fetch(`/api/questions/${quizType}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Неверный формат данных');
        
        const parsed = data.map((q: any) => ({
          ...q,
          options: typeof q.options === 'string'
            ? q.options.split(';').map((opt: string) => opt.trim())
            : q.options,
        }));
        
        setAllQuestions(parsed);
        setGameQuestions(parsed.sort(() => 0.5 - Math.random()).slice(0, 10));
        setStatus('ready');
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setStatus('error');
      });
  }, [quizType]);

  useEffect(() => {
    if (!socket || typeof roomId !== "string" || status !== 'ready') return;

    socket.emit("join", roomId, (response: { 
      success: boolean; 
      message: string;
    }) => {
      if (!response.success) {
        setError(response.message);
      } else {
        setError("");
        // Устанавливаем первый вопрос после успешного подключения
        if (gameQuestions.length > 0) {
          setCurrentQuestion(gameQuestions[0]);
        }
      }
    });

    socket.on("player-joined", (playersInRoom) => {
      setPlayers(Array.isArray(playersInRoom) ? playersInRoom : []);
    });

    socket.on("answer", (data) => {
      setAnswers((prev) => [...prev, data]);
      
      // Обновляем счет
      if (data.isCorrect) {
        setScores(prev => ({
          ...prev,
          [data.playerId]: (prev[data.playerId] || 0) + 1
        }));
      }
    });

    return () => {
      socket.off("player-joined");
      socket.off("answer");
    };
  }, [socket, roomId, status, gameQuestions]);

  const handleAnswer = (answer: string) => {
    if (!roomId || typeof roomId !== "string" || !currentQuestion) return;
    
    const isCorrect = currentQuestion.correct === answer;
    socket?.emit("answer", { 
      roomId, 
      answer,
      isCorrect,
      questionId: currentQuestion.id
    });

    // Переход к следующему вопросу после ответа всех игроков
    if (answers.length + 2 >= players.length) {
      const nextIndex = gameQuestions.findIndex(q => q.id === currentQuestion.id) + 1;
      if (nextIndex < gameQuestions.length) {
        setTimeout(() => {
          setCurrentQuestion(gameQuestions[nextIndex]);
          setAnswers([]);
        }, 100); // Задержка перед следующим вопросом
      } else {
        setGameOver(true);
      }
    }
  };

  if (status === "loading") {
    return <div>Загрузка вопросов...</div>;
  }

  if (status === "error") {
    return <div>Ошибка: {error}</div>;
  }

  if (gameOver) {
    return (
      <div>
        <h1>Игра завершена!</h1>
        <h2>Результаты:</h2>
        <ul>
          {Object.entries(scores).map(([playerId, score]) => (
            <li key={playerId}>
              Игрок {playerId}: {score} очков
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h1>Комната: {roomId}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Подключено игроков: {players.length} / 2</h3>
      <ul>
        {players.map((p) => (
          <li key={p}>
            {p} - {scores[p] || 0} очков
          </li>
        ))}
      </ul>

      {players.length < 2 ? (
        <p>Ожидание второго игрока...</p>
      ) : (
        currentQuestion && (
          <>
            <h3>Вопрос: {currentQuestion.question}</h3>
            <div>
              {currentQuestion.options.map((option, index) => (
                <button 
                  key={index} 
                  onClick={() => handleAnswer(option)}
                  disabled={answers.some(a => a.playerId === socket.id)}
                >
                  {option}
                </button>
              ))}
            </div>

            <h3>Ответы:</h3>
            <ul>
              {answers.map((a, i) => (
                <li key={i} style={{ color: a.isCorrect ? 'green' : 'red' }}>
                  Игрок {a.playerId} ответил: {a.answer}
                </li>
              ))}
            </ul>
          </>
        )
      )}
    </div>
  );
}