"use client";

import { useState } from "react";
import NicknameForm from "../ui/NicknameForm";

type LoginStepProps = {
  onLogin: (nickname: string) => void;
  defaultNickname?: string;
};

export default function LoginStep({
  onLogin,
  defaultNickname = "",
}: LoginStepProps) {
  const [nickname, setNickname] = useState(defaultNickname);

  const handleSubmit = () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    onLogin(trimmed);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <NicknameForm
        nickname={nickname}
        onChange={setNickname}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
