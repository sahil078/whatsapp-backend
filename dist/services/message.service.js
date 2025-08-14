import { MessageModel } from "../models/Message.js";
export async function upsertIncomingMessage(args) {
    const query = {};
    if (args.meta_msg_id)
        query.meta_msg_id = args.meta_msg_id;
    else if (args.msg_id)
        query.msg_id = args.msg_id;
    const doc = await MessageModel.findOneAndUpdate(Object.keys(query).length ? query : { _id: undefined }, {
        $setOnInsert: {
            wa_id: args.wa_id,
            direction: "incoming",
            type: args.type || "text",
            text: args.text,
            media_url: args.media_url,
            from: args.from,
            to: args.to,
            msg_id: args.msg_id,
            meta_msg_id: args.meta_msg_id,
            timestamp: args.timestamp || new Date(),
            status: "delivered",
            raw: args.raw
        }
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return doc;
}
export async function updateStatusById(opts) {
    const { meta_msg_id, msg_id, status, timestamp } = opts;
    const query = {};
    if (meta_msg_id)
        query.meta_msg_id = meta_msg_id;
    if (msg_id)
        query.msg_id = msg_id;
    const doc = await MessageModel.findOneAndUpdate(query, { $set: { status, ...(timestamp ? { timestamp } : {}) } }, { new: true });
    return doc;
}
export async function createOutgoingMessage(args) {
    const now = new Date();
    const doc = await MessageModel.create({
        wa_id: args.wa_id,
        direction: "outgoing",
        type: "text",
        text: args.text,
        to: args.to || args.wa_id,
        status: "sent",
        timestamp: now,
        meta_msg_id: args.meta_msg_id,
        raw: { source: "api" }
    });
    return doc;
}
export async function getConversationByWaId(wa_id) {
    return MessageModel.find({ wa_id }).sort({ timestamp: 1 }).lean();
}
export async function getConversationsList() {
    const pipeline = [
        // Oldest → newest so $last = latest per wa_id
        { $sort: { wa_id: 1, timestamp: 1 } },
        {
            $group: {
                _id: "$wa_id",
                last_direction: { $last: "$direction" },
                last_text: { $last: "$text" },
                last_type: { $last: "$type" },
                last_status: { $last: "$status" },
                last_timestamp: { $last: "$timestamp" },
                last_meta_msg_id: { $last: "$meta_msg_id" },
                last_msg_id: { $last: "$msg_id" }
            }
        },
        { $sort: { _id: 1 } }
    ];
    const rows = await MessageModel.aggregate(pipeline);
    return rows.map((r) => ({
        wa_id: r._id,
        lastMessage: {
            direction: r.last_direction,
            text: r.last_text,
            type: r.last_type,
            status: r.last_status,
            timestamp: r.last_timestamp,
            meta_msg_id: r.last_meta_msg_id,
            msg_id: r.last_msg_id
        }
    }));
}
