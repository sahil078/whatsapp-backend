import { Router } from "express";
import { makeMessagesController } from "../controllers/messages.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { postMessageSchema } from "../schemas/messages.schema.js";
export default function messagesRoutes(io) {
    const router = Router();
    const controller = makeMessagesController(io);
    router.get("/:wa_id", controller.getByWaId);
    router.post("/", validateBody(postMessageSchema), controller.postMessage);
    return router;
}
