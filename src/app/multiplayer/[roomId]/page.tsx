"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/lib/useSocket";
import { useParams, useSearchParams  } from "next/navigation";
import styles from "./RoomPage.module.css";

type Question = {
  id: string;
  question: string;
  options: string[];
  correct: string;
};

export default function RoomPage() {
  const socket = useSocket();
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const quizType = searchParams.get("quizType") || "flags";

  const [socketId, setSocketId] = useState<string | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{
    playerId: string;
    answer: string;
    isCorrect: boolean;
  }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Обновляем socketId, когда socket подключается
  useEffect(() => {
    if (!socket) return;

    if (socket.connected && socket.id !== undefined) {
      setSocketId(socket.id);
    } else {
      const onConnect = () => {
        if (socket.id !== undefined) {
          setSocketId(socket.id);
        }
      };
      socket.on("connect", onConnect);
      return () => {
        socket.off("connect", onConnect);
      };
    }
  }, [socket]);


  useEffect(() => {
    fetch(`/api/questions/${quizType}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки данных");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Неверный формат данных");

        const parsed = data.map((q: any) => ({
          ...q,
          options:
            typeof q.options === "string"
              ? q.options.split(";").map((opt: string) => opt.trim())
              : q.options,
        }));

        const shuffled = parsed.sort(() => 0.5 - Math.random()).slice(0, 10);
        setGameQuestions(shuffled);
        setCurrentQuestion(shuffled[0]);
        setStatus("ready");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setStatus("error");
      });
  }, [quizType]);

  useEffect(() => {
    if (!socket || typeof roomId !== "string" || status !== "ready") return;

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
      setPlayers(Array.isArray(playersInRoom) ? playersInRoom : []);
    });

    socket.on("answer", (data) => {
      setAnswers((prevAnswers) => {
        const newAnswers = [...prevAnswers, data];
        if (
          !prevAnswers.some(
            (a) => a.playerId === data.playerId && a.answer === data.answer
          )
        ) {
          setScores((prevScores) => ({
            ...prevScores,
            [data.playerId]: (prevScores[data.playerId] || 0) + (data.isCorrect ? 1 : 0),
          }));
        }
        return newAnswers;
      });
    });

    return () => {
      socket.off("player-joined");
      socket.off("answer");
    };
  }, [socket, roomId, status]);

  const handleAnswer = (answer: string) => {
    if (!roomId || typeof roomId !== "string" || !currentQuestion || !socketId) return;

    const isCorrect = currentQuestion.correct === answer;

    socket?.emit("answer", {
      roomId,
      answer,
      isCorrect,
      questionId: currentQuestion.id,
    });

    setAnswers((prev) => [...prev, { playerId: socketId, answer, isCorrect }]);

    if (isCorrect) {
      setScores((prev) => ({
        ...prev,
        [socketId]: (prev[socketId] || 0) + 2,
      }));
    }

    if (answers.length + 2 >= players.length) {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < gameQuestions.length) {
        setTimeout(() => {
          setCurrentQuestion(gameQuestions[nextIndex]);
          setCurrentQuestionIndex(nextIndex);
          setAnswers([]);
        }, 100);
      } else {
        setGameOver(true);
      }
    }
  };

  if (status === "loading") {
    return <div className={styles["game-container"]}>Загрузка вопросов...</div>;
  }

  if (status === "error") {
    return <div className={styles.errorMessage}>Ошибка: {error}</div>;
  }

  if (gameOver) {
    return (
      <div className={styles["game-over-container"]}>
        <h1>Игра завершена!</h1>
        <h2>Финальные результаты:</h2>
        <div className={styles.scoreboard}>
          {players.map((player) => (
            <div key={player} className={styles["player-score"]}>
              <span className={styles["player-name"]}>{player}</span>
              <span className={styles["score-value"]}>{scores[player] || 0} очков</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles["game-container"]}>
      <h1>Комната: {roomId}</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles["players-info"]}>
        <h3>Игроки ({players.length}/2):</h3>
        <ul>
          {players.map((player) => (
            <li key={player}>
              {player} - <strong>{scores[player] || 0}</strong>{" "}
              {scores[player] === 1 ? "очко" : "очков"}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.progress}>
        Вопрос {currentQuestionIndex + 1} из {gameQuestions.length}
      </div>

      {players.length < 2 ? (
        <p className={styles["waiting-message"]}>Ожидание второго игрока...</p>
      ) : (
        currentQuestion && (
          <div className={styles["question-section"]}>
            <h2 className={styles["question-text"]}>{currentQuestion.question}</h2>

            <div className={styles["options-grid"]}>
              {currentQuestion.options.map((option, index) => {
                const playerAnswer = answers.find((a) => a.playerId === socketId);
                const isAnswered = !!playerAnswer;
                const isThisOptionSelected = playerAnswer?.answer === option;
                const isCorrectOption = currentQuestion.correct === option;

                const buttonClass = [
                  styles["option-button"],
                  isAnswered ? styles.answered : "",
                  isThisOptionSelected
                    ? playerAnswer?.isCorrect
                      ? styles.correct
                      : styles.incorrect
                    : "",
                  isAnswered && isCorrectOption ? styles["show-correct"] : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answers.length > 0 && (
              <div className={styles["answers-log"]}>
                <h3>Ответы:</h3>
                <ul>
                  {answers.map((answer, i) => (
                    <li
                      key={i}
                      className={`${styles["answer-item"]} ${
                        answer.isCorrect ? styles.correct : styles.incorrect
                      }`}
                    >
                      {answer.playerId === socketId ? "Вы" : "Соперник"} ответили:{" "}
                      {answer.answer}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
