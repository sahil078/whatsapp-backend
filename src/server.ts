import "dotenv/config";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { buildApp, mountRealtimeRoutes, mountErrorHandlers } from "./app.js";
import { connectDB } from "./utils/db.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

async function main() {
  await connectDB(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB");

  // Create Express app first
  const app = buildApp();
  console.log("Express app created");
  
  // Create HTTP server with Express app
  const httpServer = createServer(app);
  
  // Attach Socket.IO to the same server
  const envOrigins = (process.env.ORIGIN || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  const defaultOrigins = [
    "http://localhost:3000",
    "https://whats-app-chat-bice.vercel.app/"
  ];
  const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }
  });
  console.log("Socket.IO attached");

  // Now mount routes that need io
  console.log("Mounting realtime routes...");
  mountRealtimeRoutes(app, io);
  console.log("Realtime routes mounted");

  // Mount terminal handlers last
  mountErrorHandlers(app);

  io.on("connection", (socket) => {
    const { wa_id } = socket.handshake.query as { wa_id?: string };
    if (wa_id) socket.join(wa_id);
    console.log(`Socket connected: ${socket.id}, wa_id: ${wa_id}`);
  });

  httpServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log("Available routes:");
    console.log("- GET /health");
    console.log("- GET /api/conversations");
    console.log("- GET /api/messages/:wa_id");
    console.log("- POST /api/messages");
    console.log("- POST /webhook/simulate");
  });
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
