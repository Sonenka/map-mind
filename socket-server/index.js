const { Server } = require("socket.io");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const io = new Server(4000, {
  cors: {
    origin: "*",
  },
});

const rooms = {}; // roomId -> { players: Set, questions: [], currentQuestionIndex: 0 }

// Функция проверки правильности ответа
async function checkAnswer(questionId, answer) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { correct: true }
    });
    return question?.correct === answer;
  } catch (error) {
    console.error("Error checking answer:", error);
    return false;
  }
}

io.on("connection", (socket) => {
  console.log("✅ Новый клиент:", socket.id);

  socket.on("join", async (roomId, callback) => {
    if (!rooms[roomId]) {
      try {
        // Загружаем вопросы из базы данных
        const questions = await prisma.question.findMany({
          where: {  }, // или другой тип викторины
          take: 10,
          select: {
            id: true,
            question: true,
            options: true,
            correct: true
          }
        });

        rooms[roomId] = {
          players: new Set(),
          questions: questions,
          currentQuestionIndex: 0
        };
      } catch (err) {
        console.error("Error loading questions:", err);
        callback({ success: false, message: "Ошибка загрузки вопросов" });
        return;
      }
    }

    if (rooms[roomId].players.size >= 2) {
      callback({ success: false, message: "Комната заполнена" });
      return;
    }

    rooms[roomId].players.add(socket.id);
    socket.join(roomId);

    callback({ 
      success: true, 
      message: "Успешное подключение",
      currentQuestion: rooms[roomId].questions[rooms[roomId].currentQuestionIndex]
    });

    // Отправляем обновленный список игроков
    const players = Array.from(rooms[roomId].players);
    io.to(roomId).emit("player-joined", players);
    
    // Отправляем текущий вопрос
    io.to(roomId).emit("new-question", 
      rooms[roomId].questions[rooms[roomId].currentQuestionIndex]
    );
  });

  // Обработчик ответов от клиентов
  socket.on("answer", async (data) => {
    try {
      const { roomId, answer, questionId } = data;
      const room = rooms[roomId];
      
      if (!room) {
        console.log("Комната не найдена");
        return;
      }

      // Проверяем правильность ответа
      const isCorrect = await checkAnswer(questionId, answer);
      
      // Отправляем ответ всем в комнате
      io.to(roomId).emit("answer", { 
        playerId: socket.id, 
        answer,
        isCorrect,
        questionId
      });

      // Проверяем, ответили ли все игроки
      moveToNextQuestion(roomId);
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId].players.has(socket.id)) {
        rooms[roomId].players.delete(socket.id);
        console.log(`❌ ${socket.id} покинул комнату ${roomId}`);

        if (rooms[roomId].players.size === 0) {
          delete rooms[roomId];
        } else {
          const players = Array.from(rooms[roomId].players);
          io.to(roomId).emit("player-joined", players);
        }
        break;
      }
    }
  });
});


// Переход к следующему вопросу
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