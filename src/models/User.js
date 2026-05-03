import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["client", "admin"], default: "client" },
    privacyAccepted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
