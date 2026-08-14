import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    investmentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    planDetails: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    dailyROIPercentage: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index to speed up "fetch active investments" queries used by cron/business logic
investmentSchema.index({ user: 1, status: 1 });

export default mongoose.model("Investment", investmentSchema);
