const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const io = new Server(4000, {
  cors: { origin: "*" },
});

const rooms = {}; // roomId -> { players: Map<socketId, playerName>, questions, currentQuestionIndex }

async function checkAnswer(questionId, answer) {
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

  socket.on("join", async ({ roomId, name }, callback) => {
    if (!rooms[roomId]) {
      try {
        const questions = await prisma.question.findMany({
          where: {},
          take: 10,
          select: { id: true, question: true, options: true, correct: true },
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

    callback({
      success: true,
      message: "Успешное подключение",
      currentQuestion: rooms[roomId].questions[rooms[roomId].currentQuestionIndex],
    });

    io.to(roomId).emit("new-question", rooms[roomId].questions[rooms[roomId].currentQuestionIndex]);
  });

  socket.on("answer", async ({ roomId, answer, questionId }) => {
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
  });

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

function moveToNextQuestion(roomId) {
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
