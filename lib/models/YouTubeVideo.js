import mongoose from "mongoose";

const YouTubeVideoSchema = new mongoose.Schema(
    {
        videoId: { type: String, unique: true, required: true },
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        url: { type: String, required: true },
        publishedAt: { type: Date, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.YouTubeVideo || mongoose.model("YouTubeVideo", YouTubeVideoSchema);
