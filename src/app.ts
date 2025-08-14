import express from "express";
import helmet from "helmet";
import cors from "cors";
import { httpLogger } from "./utils/logger.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import conversationsRoute from "./routes/conversations.routes.js";
import messagesRoute from "./routes/messages.routes.js";
import webhookRoute from "./routes/webhook.routes.js";
import type { Server as SocketIOServer } from "socket.io";

export function buildApp() {
  const app = express();
  app.use(helmet());

  app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  app.use(express.json({ limit: "1mb" }));
  app.use(httpLogger);

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Routes that don't depend on io
  app.use("/api/conversations", conversationsRoute);

  return app;
}

export function mountRealtimeRoutes(app: express.Application, io: SocketIOServer) {
  // Routes that DO depend on io
  app.use("/api/messages", messagesRoute(io));
  app.use("/webhook", webhookRoute(io));
}

export function mountErrorHandlers(app: express.Application) {
  // Keep these last
  app.use(notFound);
  app.use(errorHandler);
}
