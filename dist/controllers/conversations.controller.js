import { getConversationsList } from "../services/message.service.js";
export const conversationsController = {
    list: async (_req, res) => {
        const items = await getConversationsList();
        res.json({ conversations: items });
    }
};
