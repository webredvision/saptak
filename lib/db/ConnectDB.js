import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function ConnectDB() {
  if (!MONGODB_URI) {
    throw new Error("❌ Missing MONGODB_URI in environment variables");
  }
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 5,
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  console.log("🚀 MongoDB Connected");
  return cached.conn;
}
