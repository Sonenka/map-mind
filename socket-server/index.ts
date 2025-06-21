import { Server } from "socket.io";
import { PrismaClient, Question as PrismaQuestion } from "@prisma/client";

const prisma = new PrismaClient();

const io = new Server(4000, {
  cors: {
    // origin: "https://mapmind.ru",
    origin: "https://localhost:4000",
    methods: ["GET", "POST"],
  },
});

type Room = {
  players: Map<string, string>; // socket.id -> name
  questions: Question[];
  currentQuestionIndex: number;
};

type Question = Pick<PrismaQuestion, "id" | "question" | "options" | "correct">;

const rooms: Record<string, Room> = {};

async function checkAnswer(questionId: string, answer: string): Promise<boolean> {
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { correct: true },
    });
    return question?.correct === answer;
  } catch (error) {
    console.error("Error checking answer:", error);
    return false;
  }
}

io.on("connection", (socket) => {
  console.log("✅ Новый клиент:", socket.id);

  socket.on(
    "join",
    async (
      {
        roomId,
        name,
      }: {
        roomId: string;
        name: string;
      },
      callback: (response: {
        success: boolean;
        message: string;
        currentQuestion?: Question;
      }) => void
    ) => {
      if (!rooms[roomId]) {
        try {
          const questions = await prisma.question.findMany({
            take: 10,
            select: {
              id: true,
              question: true,
              options: true,
              correct: true,
            },
          });

          rooms[roomId] = {
            players: new Map(),
            questions,
            currentQuestionIndex: 0,
          };
        } catch (err) {
          console.error("Ошибка загрузки вопросов:", err);
          return callback({ success: false, message: "Ошибка загрузки" });
        }
      }

      if (rooms[roomId].players.size >= 2) {
        return callback({ success: false, message: "Комната заполнена" });
      }

      rooms[roomId].players.set(socket.id, name);
      socket.join(roomId);

      const playerNames = Array.from(rooms[roomId].players.values());
      io.to(roomId).emit("player-joined", playerNames);

      const currentQuestion = rooms[roomId].questions[rooms[roomId].currentQuestionIndex];

      callback({
        success: true,
        message: "Успешное подключение",
        currentQuestion,
      });

      io.to(roomId).emit("new-question", currentQuestion);
    }
  );

  socket.on(
    "answer",
    async ({
      roomId,
      answer,
      questionId,
    }: {
      roomId: string;
      answer: string;
      questionId: string;
    }) => {
      const room = rooms[roomId];
      if (!room) return;

      const isCorrect = await checkAnswer(questionId, answer);
      const name = room.players.get(socket.id);

      io.to(roomId).emit("answer", {
        playerName: name,
        answer,
        isCorrect,
        questionId,
      });

      moveToNextQuestion(roomId);
    }
  );

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        console.log(`❌ ${socket.id} покинул комнату ${roomId}`);

        if (room.players.size === 0) {
          delete rooms[roomId];
        } else {
          const playerNames = Array.from(room.players.values());
          io.to(roomId).emit("player-joined", playerNames);
        }

        break;
      }
    }
  });
});

function moveToNextQuestion(roomId: string) {
  const room = rooms[roomId];
  if (!room) return;

  room.currentQuestionIndex++;
  if (room.currentQuestionIndex < room.questions.length) {
    io.to(roomId).emit("new-question", room.questions[room.currentQuestionIndex]);
  } else {
    io.to(roomId).emit("game-over");
  }
}

console.log("🚀 Socket сервер запущен на порту 4000");
