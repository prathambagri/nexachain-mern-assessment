import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String, // stored encrypted (bcrypt hash)
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId, // parent user
      ref: "User",
      default: null,
      index: true,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    totalROIEarned: {
      type: Number,
      default: 0,
    },
    totalLevelIncomeEarned: {
      type: Number,
      default: 0,
    },
    accountStatus: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
