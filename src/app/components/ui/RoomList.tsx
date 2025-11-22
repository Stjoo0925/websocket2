"use client";

import type { Room } from "../../types/chat";

type RoomListProps = {
  rooms: Room[];
  onSelect: (roomId: string) => void;
};

export default function RoomList({ rooms, onSelect }: RoomListProps) {
  if (!rooms.length) {
    return <p className="text-sm text-neutral-200">생성된 방이 없습니다.</p>;
  }

  return (
    <ul className="space-y-2">
      {rooms.map((room) => (
        <li key={room.id}>
          <button
            type="button"
            onClick={() => onSelect(room.id)}
            className="w-full flex items-center justify-between rounded-lg border border-neutral-700/80 bg-neutral-900/80 px-4 py-3 text-left hover:bg-neutral-800/80 transition-colors"
          >
            <span className="font-medium text-neutral-50">{room.name}</span>
            <span className="text-xs text-neutral-300">{room.userCount}명</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
