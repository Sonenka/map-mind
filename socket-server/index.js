const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: {
    origin: "*",
  },
});

const rooms = {}; // roomId -> { players: Set, questions: [], current: 0 }


io.on("connection", (socket) => {
  console.log("✅ Новый клиент:", socket.id);

  socket.on("join", (roomId, callback) => {
    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
    }

    if (rooms[roomId].size >= 2) {
      callback({ success: false, message: "Комната заполнена" });
      return;
    }

    rooms[roomId].add(socket.id);
    socket.join(roomId);

    callback({ success: true, message: "Успешное подключение" });

    // Отправим список игроков ВСЕМ в комнате
    const players = Array.from(rooms[roomId]);
    console.log(`🔄 Игроки в комнате ${roomId}:`, players);
    io.to(roomId).emit("player-joined", players);
  });

  socket.on("answer", (data) => {
    const { roomId, answer } = data;
    io.to(roomId).emit("answer", { playerId: socket.id, answer });
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
});

console.log("🚀 Socket сервер запущен на порту 4000");
