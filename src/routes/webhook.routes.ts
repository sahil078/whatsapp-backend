import { Router } from "express";
import { validateBody } from "../middlewares/validate.middleware.js";
import { webhookBulkSchema } from "../schemas/webhook.schema.js";
import type { Server as SocketIOServer } from "socket.io";
import { makeWebhookController } from "../controllers/webhook.controller.js";

export default function webhookRoutes(io?: SocketIOServer) {
  const router = Router();
  const controller = makeWebhookController(io);
  router.post("/simulate", validateBody(webhookBulkSchema), controller.simulateWebhook);
  return router;
}
