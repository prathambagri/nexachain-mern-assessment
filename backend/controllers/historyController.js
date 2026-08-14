import ROIHistory from "../models/ROIHistory.js";
import ReferralIncome from "../models/ReferralIncome.js";

// @route GET /api/roi-history
export const getROIHistory = async (req, res) => {
  try {
    const history = await ROIHistory.find({ user: req.user.id })
      .sort({ date: -1 })
      .lean();

    return res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @route GET /api/referral-income
export const getReferralIncomeHistory = async (req, res) => {
  try {
    const history = await ReferralIncome.find({ receiverUser: req.user.id })
      .sort({ date: -1 })
      .lean();

    return res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
