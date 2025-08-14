import mongoose from "mongoose";
export async function connectDB(uri) {
    if (!uri)
        throw new Error("MONGODB_URI not set");
    await mongoose.connect(uri, { dbName: "whatsapp" });
    mongoose.connection.on("connected", () => {
        console.log("[db] connected to MongoDB");
    });
    mongoose.connection.on("error", (err) => {
        console.error("[db] MongoDB error:", err);
    });
}
