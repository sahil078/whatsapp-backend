import { z } from "zod";
export const statusUpdateSchema = z.object({
    meta_msg_id: z.string().optional(),
    msg_id: z.string().optional(),
    status: z.enum(["sent", "delivered", "read", "failed"]),
    timestamp: z.number().or(z.string()).optional(),
});
export const incomingMessageSchema = z.object({
    wa_id: z.string(),
    from: z.string().optional(),
    to: z.string().optional(),
    type: z.enum(["text", "image", "audio", "video", "document"]).default("text"),
    text: z.string().optional(),
    media_url: z.string().url().optional(),
    msg_id: z.string().optional(),
    meta_msg_id: z.string().optional(),
    timestamp: z.number().or(z.string()).optional()
});
export const webhookEnvelopeSchema = z.union([
    z.object({ kind: z.literal("message"), payload: incomingMessageSchema }),
    z.object({ kind: z.literal("status"), payload: statusUpdateSchema })
]);
export const webhookBulkSchema = z.union([webhookEnvelopeSchema, z.array(webhookEnvelopeSchema)]);
