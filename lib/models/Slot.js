import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    booked: { type: Boolean, default: false },
    name: String,
    email: String,
    meetLink: String,
}, { timestamps: true });

export default mongoose.models.Slot || mongoose.model("Slot", SlotSchema);
