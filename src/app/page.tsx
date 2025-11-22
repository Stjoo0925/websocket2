"use client";

import { useState } from "react";
import LoginStep from "./components/flow/LoginStep";
import RoomSelectStep from "./components/flow/RoomSelectStep";
import ChatRoomStep from "./components/flow/ChatRoomStep";
import { useChatSocket } from "./hooks/useChatSocket";
import type { Room } from "./types/chat";

type Step = "login" | "room" | "chat";

const INITIAL_ROOMS: Room[] = [
  { id: "general", name: "일반 채팅방", userCount: 0 },
  // { id: "random", name: "랜덤 수다방", userCount: 0 },
];

export default function HomePage() {
  const [step, setStep] = useState<Step>("login");
  const [username, setUsername] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

  if (!socketUrl) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL 환경 변수가 설정되지 않았습니다.");
  }

  const {
    connected,
    messages,
    sendMessage,
    sendFileMessage,
    roomUserCounts,
    joinRoom,
    leaveRoom,
    clearMessages,
  } = useChatSocket(socketUrl);

  const handleLogin = (nickname: string) => {
    setUsername(nickname);
    setStep("room");
  };

  const handleSelectRoom = (roomId: string) => {
    if (!username.trim()) return;
    setCurrentRoomId(roomId);
    joinRoom(roomId, username);
    setStep("chat");
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setCurrentRoomId(null);
    setStep("room");
  };

  const handleSend = () => {
    if (!input.trim() || !currentRoomId || !username.trim()) return;
    sendMessage(input, currentRoomId, username);
    setInput("");
  };

  const handleSendFile = (file: File) => {
    if (!currentRoomId || !username.trim()) return;
    sendFileMessage(file, currentRoomId, username);
  };

  const handleLogout = () => {
    leaveRoom();
    clearMessages();
    setCurrentRoomId(null);
    setInput("");
    setUsername("");
    setStep("login");
  };

  const rooms: Room[] = INITIAL_ROOMS.map((room) => ({
    ...room,
    userCount: roomUserCounts[room.id] ?? 0,
  }));
  const currentRoom =
    rooms.find((room) => room.id === currentRoomId) ?? rooms[0];

  if (step === "login") {
    return <LoginStep onLogin={handleLogin} defaultNickname={username} />;
  }

  if (step === "room") {
    return (
      <RoomSelectStep
        username={username}
        rooms={rooms}
        onSelectRoom={handleSelectRoom}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <ChatRoomStep
      username={username}
      room={currentRoom}
      connected={connected}
      messages={messages}
      input={input}
      onInputChange={setInput}
      onSendMessage={handleSend}
      onSendFileMessage={handleSendFile}
      onLeaveRoom={handleLeaveRoom}
      onLogout={handleLogout}
    />
  );
}
