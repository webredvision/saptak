import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        experience: {
            type: String,
            enum: ["good", "bad", "excellent"],
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        likedThings: {
            type: String,
        },
        userIP: {
            type: String,
            required: true,
            unique: true, // restrict duplicate feedbacks from same IP
        },
    },
    { timestamps: true }
);

export default mongoose.models.Feedback ||
    mongoose.model("Feedback", FeedbackSchema);
