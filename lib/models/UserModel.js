import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["ADMIN", "DEVADMIN"],
      required: true,
    },

    otpHash: String,
    otpExpiry: Date,

    failedLoginAttempts: { type: Number, default: 0 },
    failedOtpAttempts: { type: Number, default: 0 },
    blockUntil: Date,
     sessionsversion: {
      type: Map,
      of: {
        version: Number,
        createdAt: Date,
        expiresAt:Date,
      },
      default: {},
    },
    resetPasswordRequestId:String,
    resetPasswordToken: String,
    resetPasswordExpiry: Date, // Date object
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const UserModel =
  mongoose.models.users || mongoose.model("users", UserSchema);

export default UserModel;