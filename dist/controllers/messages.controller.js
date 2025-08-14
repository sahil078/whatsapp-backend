import { postMessageSchema } from "../schemas/messages.schema.js";
import { createOutgoingMessage, getConversationByWaId } from "../services/message.service.js";
export function makeMessagesController(io) {
    return {
        getByWaId: async (req, res) => {
            const { wa_id } = req.params;
            const msgs = await getConversationByWaId(wa_id);
            res.json({ wa_id, messages: msgs });
        },
        postMessage: async (req, res) => {
            const data = postMessageSchema.parse(req.body);
            const doc = await createOutgoingMessage(data);
            io?.to(doc.wa_id).emit("message:new", doc);
            res.status(201).json(doc);
        }
    };
}
