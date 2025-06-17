"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io("http://localhost:4000"); // адрес отдельного WS сервера
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
}
