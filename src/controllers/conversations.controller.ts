import { Request, Response } from "express";
import { getConversationsList } from "../services/message.service.js";

export const conversationsController = {
  list: async (_req: Request, res: Response) => {
    const items = await getConversationsList();
    res.json({ conversations: items });
  }
};
