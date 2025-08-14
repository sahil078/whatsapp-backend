import { webhookBulkSchema } from "../schemas/webhook.schema.js";
import { upsertIncomingMessage, updateStatusById } from "../services/message.service.js";
export function makeWebhookController(io) {
    return {
        simulateWebhook: async (req, res) => {
            const parsed = webhookBulkSchema.parse(req.body);
            const items = Array.isArray(parsed) ? parsed : [parsed];
            const results = [];
            for (const item of items) {
                if (item.kind === "message") {
                    const p = item.payload;
                    const doc = await upsertIncomingMessage({
                        wa_id: p.wa_id,
                        type: p.type || "text",
                        text: p.text,
                        media_url: p.media_url,
                        from: p.from,
                        to: p.to,
                        msg_id: p.msg_id,
                        meta_msg_id: p.meta_msg_id,
                        timestamp: p.timestamp ? new Date(Number(p.timestamp)) : new Date(),
                        raw: item
                    });
                    results.push({ kind: "message", id: doc._id, wa_id: doc.wa_id });
                    io?.to(doc.wa_id).emit("message:new", doc);
                }
                else if (item.kind === "status") {
                    const p = item.payload;
                    const doc = await updateStatusById({
                        meta_msg_id: p.meta_msg_id,
                        msg_id: p.msg_id,
                        status: p.status,
                        timestamp: p.timestamp ? new Date(Number(p.timestamp)) : undefined
                    });
                    results.push({ kind: "status", updated: !!doc, meta_msg_id: p.meta_msg_id, msg_id: p.msg_id, status: p.status });
                    if (doc)
                        io?.to(doc.wa_id).emit("message:status", { meta_msg_id: doc.meta_msg_id, msg_id: doc.msg_id, status: doc.status });
                }
            }
            res.json({ ok: true, items: results });
        }
    };
}
