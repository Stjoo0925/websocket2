"use client";

import type { FormEvent } from "react";

type NicknameFormProps = {
  nickname: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function NicknameForm({
  nickname,
  onChange,
  onSubmit,
}: NicknameFormProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto rounded-xl bg-neutral-900/80 p-6 border border-neutral-700/80 shadow-lg backdrop-blur"
    >
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-100">닉네임</span>
        <input
          className="border border-neutral-600/80 rounded px-3 py-2 bg-neutral-900 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-neutral-300"
          value={nickname}
          onChange={(event) => onChange(event.target.value)}
          placeholder="닉네임을 입력하세요"
        />
      </label>
      <button
        type="submit"
        className="rounded bg-neutral-100/90 hover:bg-white px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50 transition-colors"
        disabled={!nickname.trim()}
      >
        시작하기
      </button>
    </form>
  );
}
