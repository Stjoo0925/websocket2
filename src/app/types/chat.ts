export type Room = {
  id: string;
  name: string;
  userCount: number;
};

export type ChatMessageType = "text" | "image" | "file";

export type ChatFilePayload = {
  name: string;
  size: number;
  mimeType: string;
  url: string; // data URL or remote URL
};

export type ChatMessage = {
  id: string;
  roomId: string;
  username: string;
  type: ChatMessageType;
  text?: string;
  file?: ChatFilePayload;
};
