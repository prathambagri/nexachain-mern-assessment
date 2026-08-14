import mongoose from "mongoose";

const referralIncomeSchema = new mongoose.Schema(
  {
    receiverUser: {
      // user who receives the income
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sourceUser: {
      // user who generated the income
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    referralLevel: {
      type: Number,
      required: true,
      min: 1,
    },
    incomeAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ReferralIncome", referralIncomeSchema);
