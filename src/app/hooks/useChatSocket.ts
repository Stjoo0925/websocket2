"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { ChatMessage } from "../types/chat";

export function useChatSocket(serverUrl: string) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomUserCounts, setRoomUserCounts] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const socket = io(serverUrl, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on(
      "roomUsersUpdate",
      (payload: { roomId: string; userCount: number }[]) => {
        setRoomUserCounts(() => {
          const next: Record<string, number> = {};
          payload.forEach((item) => {
            next[item.roomId] = item.userCount;
          });
          return next;
        });
      }
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("roomUsersUpdate");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl]);

  const sendMessage = useCallback(
    (text: string, roomId: string, username: string) => {
      const socket = socketRef.current;
      if (!socket || !text.trim() || !roomId.trim() || !username.trim()) return;
      socket.emit("message", { roomId, username, text, type: "text" });
    },
    []
  );

  const sendFileMessage = useCallback(
    (file: File, roomId: string, username: string) => {
      const socket = socketRef.current;
      if (!socket || !roomId.trim() || !username.trim() || !file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string") return;

        const isImage = file.type.startsWith("image/");

        socket.emit("message", {
          roomId,
          username,
          type: isImage ? "image" : "file",
          text: file.name,
          file: {
            name: file.name,
            size: file.size,
            mimeType: file.type,
            url: result,
          },
        });
      };

      reader.readAsDataURL(file);
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const joinRoom = useCallback((roomId: string, username: string) => {
    const socket = socketRef.current;
    if (!socket || !roomId.trim() || !username.trim()) return;
    socket.emit("joinRoom", { roomId, username });
  }, []);

  const leaveRoom = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("leaveRoom");
  }, []);

  return {
    connected,
    messages,
    sendMessage,
    sendFileMessage,
    clearMessages,
    roomUserCounts,
    joinRoom,
    leaveRoom,
  };
}
