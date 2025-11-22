"use client";

import type { Room } from "../../types/chat";
import RoomList from "../ui/RoomList";

type RoomSelectStepProps = {
  username: string;
  rooms: Room[];
  onSelectRoom: (roomId: string) => void;
  onLogout: () => void;
};

export default function RoomSelectStep({
  username,
  rooms,
  onSelectRoom,
  onLogout,
}: RoomSelectStepProps) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-black/40 p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">안녕하세요,</p>
            <p className="text-xl font-semibold">{username}님</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs rounded bg-white/10 px-3 py-1 text-white hover:bg-white/20 border border-white/20"
          >
            로그아웃
          </button>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-medium text-white/80">방 선택</h2>
          <RoomList rooms={rooms} onSelect={onSelectRoom} />
        </div>
      </div>
    </main>
  );
}
