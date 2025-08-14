import { Router } from "express";
import { makeMessagesController } from "../controllers/messages.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { postMessageSchema } from "../schemas/messages.schema.js";
import type { Server as SocketIOServer } from "socket.io";

export default function messagesRoutes(io?: SocketIOServer) {
  const router = Router();
  const controller = makeMessagesController(io);
  router.get("/:wa_id", controller.getByWaId);
  router.post("/", validateBody(postMessageSchema), controller.postMessage);
  return router;
}
