"use client";

import { useRef, type ChangeEvent, type KeyboardEvent } from "react";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSendFile: (file: File) => void;
};

export default function MessageInput({
  value,
  onChange,
  onSend,
  onSendFile,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  const handleClickFileButton = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxBytes) {
      // 너무 큰 파일은 전송하지 않음
      alert("파일 용량이 너무 큽니다. 2MB 이하의 파일만 전송할 수 있습니다.");
      event.target.value = "";
      return;
    }

    onSendFile(file);
    event.target.value = "";
  };

  return (
    <div className="flex gap-2 p-4 border-t border-neutral-700/80 bg-neutral-900/80">
      <button
        type="button"
        onClick={handleClickFileButton}
        className="flex items-center justify-center rounded-md border border-neutral-600/80 bg-neutral-950 px-3 text-sm text-neutral-200 hover:bg-neutral-800/80 transition-colors"
      >
        📎
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        className="flex-1 rounded-md border border-neutral-600/80 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-neutral-300"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
      />
      <button
        type="button"
        onClick={onSend}
        className="rounded-md bg-neutral-100/90 hover:bg-white px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50 transition-colors"
        disabled={!value.trim()}
      >
        전송
      </button>
    </div>
  );
}
