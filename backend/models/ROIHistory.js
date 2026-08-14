import mongoose from "mongoose";

const roiHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
      index: true,
    },
    roiAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Credited", "Pending", "Failed"],
      default: "Credited",
    },
  },
  { timestamps: true }
);

// unique index so the same investment can't get ROI credited twice on the same day
roiHistorySchema.index({ investment: 1, date: 1 }, { unique: true });

export default mongoose.model("ROIHistory", roiHistorySchema);
