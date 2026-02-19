import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. "theme"
  value: { type: mongoose.Schema.Types.Mixed },
});

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
