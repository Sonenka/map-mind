'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSocket } from '@/lib/useSocket';
import { useParams, useSearchParams } from 'next/navigation';
import styles from './RoomPage.module.css';
import MenuButton from '@/components/buttons/MenuButton/MenuButton';
import ProgressBar from '@/components/ProgressBar/ProgressBar';

type Question = {
  id: string;
  question: string;
  options: string[];
  correct: string;
  image?: string;
};

export default function RoomPage() {
  const socket = useSocket();
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const quizType = searchParams.get('quizType') || 'flags';

  const [socketId, setSocketId] = useState<string | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [answers, setAnswers] = useState<
    { playerId: string; answer: string; isCorrect: boolean }[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [error, setError] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { data: session, status: sessionStatus } = useSession();

  // Стейт для кнопки копирования
  const [copied, setCopied] = useState(false);

  // Получаем текущий URL для копирования
  const inviteLink = typeof window !== 'undefined' ? window.location.href : '';

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
      socket.on('connect', onConnect);
      return () => {
        socket.off('connect', onConnect);
      };
    }
  }, [socket]);

  useEffect(() => {
    fetch(`/api/questions/${quizType}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then((data: Question[]) => {
        if (!Array.isArray(data)) throw new Error('Неверный формат данных');
        const parsed = data.map((q) => ({
          ...q,
          options:
            typeof q.options === 'string'
              ? (q.options as string).split(';').map((opt: string) => opt.trim())
              : q.options,
        }));
        const shuffled = parsed.sort(() => 0.5 - Math.random()).slice(0, 10);
        setGameQuestions(shuffled);
        setCurrentQuestion(shuffled[0]);
        setStatus('ready');
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setStatus('error');
      });
  }, [quizType]);

  useEffect(() => {
    if (!socket || typeof roomId !== 'string' || status !== 'ready') return;
    if (sessionStatus !== 'authenticated') return;

    const playerName = session?.user?.name || 'Игрок';

    socket.emit(
      'join',
      { roomId, name: playerName },
      (response: { success: boolean; message: string }) => {
        if (!response.success) {
          setError(response.message);
        } else {
          setError('');
        }
      }
    );

    socket.on('player-joined', (names: string[]) => {
      setPlayers(names);
    });

    socket.on('answer', (data) => {
      setAnswers((prev) => [...prev, data]);
      setScores((prev) => ({
        ...prev,
        [data.playerName]: (prev[data.playerName] || 0) + (data.isCorrect ? 1 : 0),
      }));
    });

    return () => {
      socket.off('player-joined');
      socket.off('answer');
    };
  }, [socket, roomId, status, session, sessionStatus]);

  const handleAnswer = (answer: string) => {
    if (!roomId || typeof roomId !== 'string' || !currentQuestion || !socketId) return;

    const isCorrect = currentQuestion.correct === answer;

    socket?.emit('answer', {
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

  // Новая функция копирования ссылки
  const handleCopyClick = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (status === 'loading') {
    return <div className={styles.wrapper}>Загрузка вопросов...</div>;
  }

  if (status === 'error') {
    return <div className={styles.errorMessage}>Ошибка: {error}</div>;
  }

  if (gameOver) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.gameContainer}>
          <h2>Игра завершена!</h2>
          <p>Финальные результаты:</p>
          <div className={styles.scoreboard}>
            {players.map((player) => (
              <div key={player} className={styles.playerScore}>
                <span className={styles.playerName}>{player}</span>
                <span className={styles.scoreValue}>{scores[player] || 0} очков</span>
              </div>
            ))}
          </div>
          <MenuButton href="/multiplayer/create" variant='back'>
            Заново
          </MenuButton>
        </div>
      </div>
    );

  }

  const isImageAnswers = currentQuestion?.options[0]?.startsWith('http');

  return (
    <div className={styles.wrapper}>

      <div className={styles.playersInfo}>
        <h3>Игроки ({players.length}/2):</h3>
        <ul>
          {players.map((player) => (
            <li key={player}>
              {player} — <strong>{scores[player] || 0}</strong> {scores[player] === 1 ? 'очко' : 'очков'}
            </li>
          ))}
        </ul>
      </div>

      {players.length < 2 ? (
        <div className={styles.gameContainer}>
          <h2>Ожидание второго игрока...</h2>
          <p>Скопируй ссылку, чтобы пригласить друга:</p>
          <div className={styles.inviteLinkBox}>
            <input
              type="text"
              readOnly
              value={inviteLink}
              className={styles.inviteLinkInput}
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              type="button"
              onClick={handleCopyClick}
              className={styles.copyButton}
              aria-label="Копировать ссылку"
            >
              {copied ? 'Скопировано!' : 'Копировать'}
            </button>
          </div>
        </div>
        
      ) : (
        currentQuestion && (
          <div className={styles.gameContainer}>
            
          <ProgressBar current={currentQuestionIndex + 1} total={gameQuestions.length} />
          <div className={styles.questionSection}>
            {currentQuestion.question?.startsWith('http') ? (
              <div className={styles.imageWrapper}>
                <img
                  src={currentQuestion.image ?? currentQuestion.question}
                  alt="Изображение вопроса"
                  className={styles.questionImage}
                  onError={(e) => {
                    e.currentTarget.src = '/default.png';
                  }}
                />
              </div>
            ) : (
              <h2 className={styles.questionText}>{currentQuestion.question}</h2>
            )}

            {currentQuestion.image && (
              <div className={styles.imageWrapper}>
                <img
                  src={currentQuestion.image}
                  alt="Изображение вопроса"
                  className={styles.questionImage}
                  onError={(e) => {
                    e.currentTarget.src = '/default.png';
                  }}
                />
              </div>
            )}

            {isImageAnswers ? (
              <div className={styles.imageOptions}>
                {currentQuestion.options.map((option, index) => {
                  const playerAnswer = answers.find((a) => a.playerId === socketId);
                  const isAnswered = !!playerAnswer;
                  const isThisOptionSelected = playerAnswer?.answer === option;
                  const isCorrectOption = currentQuestion.correct === option;

                  const optionClass = [
                    styles.option,
                    isAnswered ? styles.answered : '',
                    isThisOptionSelected
                      ? playerAnswer?.isCorrect
                        ? styles.correct
                        : styles.incorrect
                      : '',
                    isAnswered && isCorrectOption ? styles.showCorrect : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <div
                      key={index}
                      className={optionClass}
                      onClick={() => !isAnswered && handleAnswer(option)}
                    >
                      <img
                        src={option}
                        alt={`Изображение ${index + 1}`}
                        className={styles.flagImage}
                        onError={(e) => {
                          e.currentTarget.src = '/default-flag.png';
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.optionsGrid}>
                {currentQuestion.options.map((option, index) => {
                  const playerAnswer = answers.find((a) => a.playerId === socketId);
                  const isAnswered = !!playerAnswer;
                  const isThisOptionSelected = playerAnswer?.answer === option;
                  const isCorrectOption = currentQuestion.correct === option;

                  const buttonClass = [
                    styles.optionButton,
                    isAnswered ? styles.answered : '',
                    isThisOptionSelected
                      ? playerAnswer?.isCorrect
                        ? styles.correct
                        : styles.incorrect
                      : '',
                    isAnswered && isCorrectOption ? styles.showCorrect : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

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
            )}
            </div>
          </div>
        )
        
      )}
      <MenuButton href="/multiplayer" variant="back">
        Сдаться
      </MenuButton>
    </div>
  );
}