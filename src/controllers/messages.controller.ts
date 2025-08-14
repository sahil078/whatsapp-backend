import { Request, Response } from "express";
import { postMessageSchema } from "../schemas/messages.schema.js";
import { createOutgoingMessage, getConversationByWaId } from "../services/message.service.js";
import type { Server as SocketIOServer } from "socket.io";

export function makeMessagesController(io?: SocketIOServer) {
  return {
    getByWaId: async (req: Request, res: Response) => {
      const { wa_id } = req.params;
      const msgs = await getConversationByWaId(wa_id);
      res.json({ wa_id, messages: msgs });
    },

    postMessage: async (req: Request, res: Response) => {
      const data = postMessageSchema.parse(req.body);
      const doc = await createOutgoingMessage(data);
      io?.to(doc.wa_id).emit("message:new", doc);
      res.status(201).json(doc);
    }
  };
}
