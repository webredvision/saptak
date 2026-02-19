import mongoose from "mongoose";

const BotLeadsSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    services: { type: String, default: "" },
    address: { type: String, default: "" },
    isComplete: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
); 

const BotLeadsModel =
  mongoose.models.BotLeads || mongoose.model("BotLeads", BotLeadsSchema);

export default BotLeadsModel;
