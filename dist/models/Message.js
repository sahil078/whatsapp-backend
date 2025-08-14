import mongoose, { Schema } from "mongoose";
const MessageSchema = new Schema({
    wa_id: { type: String, index: true, required: true },
    direction: { type: String, enum: ["incoming", "outgoing"], required: true },
    type: { type: String, enum: ["text", "image", "audio", "video", "document", "status"], required: true },
    text: { type: String },
    media_url: { type: String },
    from: { type: String },
    to: { type: String },
    msg_id: { type: String, index: true },
    meta_msg_id: { type: String, index: true },
    status: { type: String, enum: ["queued", "sent", "delivered", "read", "failed"], default: "queued", index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    raw: { type: Schema.Types.Mixed }
}, { timestamps: true });
MessageSchema.index({ wa_id: 1, timestamp: -1 });
MessageSchema.index({ msg_id: 1 }, { unique: false, sparse: true });
MessageSchema.index({ meta_msg_id: 1 }, { unique: false, sparse: true });
export const MessageModel = mongoose.model("Message", MessageSchema, "processed_messages");
