import { z } from "zod";

export const postMessageSchema = z.object({
  wa_id: z.string(),
  to: z.string().optional(),
  text: z.string().min(1, "text required"),
  meta_msg_id: z.string().optional()
});
