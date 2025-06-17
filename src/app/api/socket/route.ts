import { NextResponse } from "next/server";
import { Server } from "socket.io";

export async function GET(request: Request) {
  // Запускаем сервер WebSocket, если еще не запущен
  if (!(global as any).ioServer) {
    const io = new Server({
      cors: {
        origin: "*", // Для разработки
      },
      // Можно добавить другие опции
    });

    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("join", (roomId) => {
        socket.join(roomId);
        io.to(roomId).emit("player-joined", socket.id);
      });

      socket.on("answer", (data) => {
        io.to(data.roomId).emit("answer", data);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });

    (global as any).ioServer = io;
  }

  return NextResponse.json({ status: "Socket server running" });
}
