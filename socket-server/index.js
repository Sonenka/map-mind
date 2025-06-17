const { PrismaClient } = require('@prisma/client')

const { Server } = require("socket.io");
const prisma = new PrismaClient();

const questions = await prisma.question.findMany();



const io = new Server(4000, {
  cors: {
    origin: "*",
  },
});
rooms[roomId] = {
  players: new Set([socket.id]),
  questions: questions,
  current: 0
};

io.on("connection", (socket) => {
  console.log("✅ Новый клиент:", socket.id);

  socket.on("join", (roomId, callback) => {
    try {
      if (!rooms[roomId]) {
        // Загружаем вопросы из базы данных при создании комнаты
        const questions = prisma.question.findMany({
          take: 10, // Берем 10 случайных вопросов
          orderBy: {
            id: 'desc' // Или другой порядок
          },
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
      }
      if (!rooms[roomId]) {
    callback({ success: false, message: "Комната не существует" });
    return;
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
      
      // Отправляем текущий вопрос всем игрокам
      io.to(roomId).emit("new-question", 
        rooms[roomId].questions[rooms[roomId].currentQuestionIndex]
      );
    } catch (err) {
      console.error("Ошибка при подключении к комнате:", err);
      callback({ success: false, message: "Ошибка сервера" });
    }
  });

  socket.on("set-questions", ({ roomId, questions }) => {
  if (rooms[roomId]) {
    rooms[roomId].questions = questions;
    rooms[roomId].currentQuestionIndex = 0;
    // Рассылаем вопросы всем участникам комнаты
    io.to(roomId).emit("receive-questions", questions);
  }
});

  socket.on("answer", (data) => {
    const { roomId, answer, questionId } = data;
    const room = rooms[roomId];
    
    // Проверяем правильность ответа
    const currentQuestion = room.questions[room.currentQuestionIndex];
    const isCorrect = currentQuestion.correct === answer;
    
    io.to(roomId).emit("answer", { 
      playerId: socket.id, 
      answer,
      isCorrect
    });
  });

socket.on("next-question", ({ roomId, index }) => {
  if (rooms[roomId]) {
    rooms[roomId].currentQuestionIndex = index;
    io.to(roomId).emit("next-question", index);
  }
});

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId].has(socket.id)) {
        rooms[roomId].delete(socket.id);
        console.log(`❌ ${socket.id} покинул комнату ${roomId}`);

        if (rooms[roomId].size === 0) {
          delete rooms[roomId];
        } else {
          const players = Array.from(rooms[roomId]);
          io.to(roomId).emit("player-joined", players);
        }

        break;
      }
    }
  });

  socket.on("game-over", (roomId) => {
  io.to(roomId).emit("game-over");
});
});

console.log("🚀 Socket сервер запущен на порту 4000");
