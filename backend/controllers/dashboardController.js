import mongoose from "mongoose";
import User from "../models/User.js";
import Investment from "../models/Investment.js";

// @route GET /api/dashboard
// @access Private
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // wallet/ROI/level-income totals already live on the User doc
    const userPromise = User.findById(userId)
      .select("walletBalance totalROIEarned totalLevelIncomeEarned")
      .lean();

    // sum investment amounts in one query instead of fetching all docs
    const investmentAggPromise = Investment.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalInvestments: { $sum: "$investmentAmount" } } },
    ]);

    const [user, investmentAgg] = await Promise.all([userPromise, investmentAggPromise]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const totalInvestments = investmentAgg.length > 0 ? investmentAgg[0].totalInvestments : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalInvestments,
        totalROIEarned: user.totalROIEarned,
        totalLevelIncomeEarned: user.totalLevelIncomeEarned,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
