"use client";

import { useState } from "react";
import type { ChatMessage } from "../../types/chat";
import ImagePreviewModal from "./ImagePreviewModal";

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
};

const getFileIcon = (mimeType: string, name: string): string => {
  if (mimeType === "application/pdf" || name.toLowerCase().endsWith(".pdf")) {
    return "📕";
  }
  if (mimeType.startsWith("video/")) {
    return "🎬";
  }
  if (mimeType.startsWith("audio/")) {
    return "🎵";
  }
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.toLowerCase().endsWith(".doc") ||
    name.toLowerCase().endsWith(".docx")
  ) {
    return "📄";
  }
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    name.toLowerCase().endsWith(".xls") ||
    name.toLowerCase().endsWith(".xlsx")
  ) {
    return "📊";
  }
  return "📎";
};

type MessageListProps = {
  messages: ChatMessage[];
  currentUsername: string;
};

export default function MessageList({
  messages,
  currentUsername,
}: MessageListProps) {
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    name: string;
    username: string;
  } | null>(null);

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-2 p-4 bg-neutral-900/70 custom-scrollbar">
        {messages.map((message, index) => {
          const isMine = message.username === currentUsername;
          const key =
            message.id || `${message.roomId}-${message.username}-${index}`;

          const kind: "text" | "image" | "file" =
            message.type &&
            (message.type === "text" ||
              message.type === "image" ||
              message.type === "file")
              ? message.type
              : message.file?.mimeType?.startsWith("image/")
              ? "image"
              : message.file
              ? "file"
              : "text";

          const initial = (message.username || "?").charAt(0).toUpperCase();

          return (
            <div
              key={key}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 ${
                  isMine ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isMine
                      ? "bg-emerald-500 text-white"
                      : "bg-neutral-700 text-neutral-50"
                  }`}
                >
                  {initial}
                </div>
                <div className="flex flex-col space-y-1 max-w-xs">
                  <span
                    className={`text-xs font-semibold ${
                      isMine
                        ? "text-emerald-100 text-right"
                        : "text-neutral-200"
                    }`}
                  >
                    {message.username}
                  </span>
                  <div
                    className={`w-72 rounded-2xl px-3 py-2 border text-sm shadow-sm break-words whitespace-pre-wrap ${
                      isMine
                        ? "bg-emerald-600/90 border-emerald-400/80 text-white"
                        : "bg-neutral-800/90 border-neutral-700/80 text-neutral-50"
                    }`}
                  >
                    {kind === "text" && (message.text || "")}

                    {kind === "image" && message.file && (
                      <div className="space-y-1">
                        <img
                          src={message.file.url}
                          alt={message.file.name}
                          className="max-h-64 w-full rounded-md object-contain bg-black/20 cursor-zoom-in"
                          onClick={() =>
                            setPreviewImage({
                              url: message.file!.url,
                              name: message.file!.name,
                              username: message.username,
                            })
                          }
                        />
                      </div>
                    )}

                    {kind === "file" && message.file && (
                      <a
                        href={message.file.url}
                        download={message.file.name}
                        className="flex items-center gap-3 text-xs no-underline hover:bg-neutral-700/80 rounded-lg px-2 py-1 -mx-2 -my-1"
                      >
                        <span className="text-lg">
                          {getFileIcon(
                            message.file.mimeType,
                            message.file.name
                          )}
                        </span>
                        <span className="flex flex-col min-w-0">
                          <span className="font-semibold truncate">
                            {message.file.name}
                          </span>
                          <span className="text-[11px] text-neutral-300">
                            {formatFileSize(message.file.size)}
                          </span>
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );
}
