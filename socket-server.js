import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL;

const roomMembers = new Map(); // roomId -> Set<socketId>
const userRooms = new Map(); // socketId -> roomId

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
  // 허용되는 단일 메시지 최대 크기 (기본 1MB). 이미지 데이터 URL 전송을 위해 5MB로 상향.
  maxHttpBufferSize: 5 * 1024 * 1024,
});

function broadcastRoomUsers() {
  const payload = Array.from(roomMembers.entries()).map(
    ([roomId, members]) => ({
      roomId,
      userCount: members.size,
    })
  );

  io.emit("roomUsersUpdate", payload);
}

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  const removeFromCurrentRoom = () => {
    const roomId = userRooms.get(socket.id);
    if (!roomId) return;

    const members = roomMembers.get(roomId);
    if (members) {
      members.delete(socket.id);
      if (members.size === 0) {
        roomMembers.delete(roomId);
      }
    }

    socket.leave(roomId);
    userRooms.delete(socket.id);
  };

  socket.on("joinRoom", ({ roomId, username }) => {
    if (!roomId) return;

    const previousRoomId = userRooms.get(socket.id);
    if (previousRoomId && previousRoomId !== roomId) {
      const previousMembers = roomMembers.get(previousRoomId);
      if (previousMembers) {
        previousMembers.delete(socket.id);
        if (previousMembers.size === 0) {
          roomMembers.delete(previousRoomId);
        }
      }
      socket.leave(previousRoomId);
    }

    socket.join(roomId);

    let members = roomMembers.get(roomId);
    if (!members) {
      members = new Set();
      roomMembers.set(roomId, members);
    }

    members.add(socket.id);
    userRooms.set(socket.id, roomId);

    console.log(`user ${username || "unknown"} joined room:`, roomId);
    broadcastRoomUsers();
  });

  socket.on("leaveRoom", () => {
    removeFromCurrentRoom();
    broadcastRoomUsers();
  });

  socket.on("message", (payload) => {
    if (!payload || typeof payload !== "object") return;

    const { roomId, username, text, type, file } = payload;
    if (!roomId) return;

    const kind = type || "text";

    if (kind === "text" && !text) {
      return;
    }

    if ((kind === "image" || kind === "file") && !file) {
      return;
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const message = {
      id,
      roomId,
      username: username || "알 수 없음",
      type: kind,
      text: text ?? "",
      file,
    };

    console.log(
      `message from client [${message.roomId}] ${message.username}:`,
      message.text,
      message.file ? `(file: ${message.file.name})` : ""
    );

    io.to(roomId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
    removeFromCurrentRoom();
    broadcastRoomUsers();
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`server running at http://localhost:${process.env.PORT || 4000}`);
});

app.get("/health", (req, res) => {
  res.send("ok");
});
