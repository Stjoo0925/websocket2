"use client";

import type { Room, ChatMessage } from "../../types/chat";
import MessageList from "../ui/MessageList";
import MessageInput from "../ui/MessageInput";

type ChatRoomStepProps = {
  username: string;
  room: Room;
  connected: boolean;
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onSendFileMessage: (file: File) => void;
  onLeaveRoom: () => void;
  onLogout: () => void;
};

export default function ChatRoomStep({
  username,
  room,
  connected,
  messages,
  input,
  onInputChange,
  onSendMessage,
  onSendFileMessage,
  onLeaveRoom,
  onLogout,
}: ChatRoomStepProps) {
  return (
    <main className="flex h-[100svh] items-center justify-center px-4">
      <div className="flex h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-neutral-900/80 border border-neutral-700/80 shadow-lg overflow-hidden backdrop-blur">
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-700/70 bg-neutral-900/80">
          <div>
            <p className="text-xs text-neutral-300">현재 방</p>
            <p className="text-sm font-semibold text-white">{room.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800/80 px-2 py-0.5">
                <span
                  className={`inline-flex h-2 w-2 rounded-full ${
                    connected ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
                <span className="text-[11px] text-neutral-100">
                  {connected ? "온라인" : "연결 끊김"}
                </span>
              </span>
              <span className="text-[11px] text-neutral-300">
                {room.userCount}명 참여 중
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLeaveRoom}
                className="rounded bg-neutral-700/80 hover:bg-neutral-600 px-3 py-1 text-xs font-medium text-neutral-100 transition-colors"
              >
                방 나가기
              </button>
              {/* <button
                type="button"
                onClick={onLogout}
                className="rounded bg-rose-900/50 hover:bg-rose-900/80 border border-rose-800/50 px-3 py-1 text-xs font-medium text-rose-200 transition-colors"
              >
                로그아웃
              </button> */}
            </div>
          </div>
        </header>
        <MessageList messages={messages} currentUsername={username} />
        <MessageInput
          value={input}
          onChange={onInputChange}
          onSend={onSendMessage}
          onSendFile={onSendFileMessage}
        />
      </div>
    </main>
  );
}
