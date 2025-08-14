import express from "express";
import helmet from "helmet";
import cors from "cors";
import { httpLogger } from "./utils/logger.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import conversationsRoute from "./routes/conversations.routes.js";
import messagesRoute from "./routes/messages.routes.js";
import webhookRoute from "./routes/webhook.routes.js";
export function buildApp() {
    const app = express();
    app.use(helmet());
    const envOrigins = (process.env.ORIGIN || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    const defaultOrigins = [
        "http://localhost:3000",
        "https://whats-app-chat-bice.vercel.app"
    ];
    const allowedOriginsSet = new Set([...defaultOrigins, ...envOrigins]);
    const corsOptions = {
        origin(origin, callback) {
            if (!origin)
                return callback(null, true);
            if (allowedOriginsSet.has(origin))
                return callback(null, true);
            return callback(null, false);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    };
    app.use(cors(corsOptions));
    app.options("*", cors(corsOptions));
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
export function mountRealtimeRoutes(app, io) {
    // Routes that DO depend on io
    app.use("/api/messages", messagesRoute(io));
    app.use("/webhook", webhookRoute(io));
}
export function mountErrorHandlers(app) {
    // Keep these last
    app.use(notFound);
    app.use(errorHandler);
}
