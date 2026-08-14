import Investment from "../models/Investment.js";

// @route POST /api/investments
export const createInvestment = async (req, res) => {
  try {
    const { investmentAmount, planDetails, startDate, endDate, dailyROIPercentage } = req.body;

    if (!investmentAmount || !planDetails || !startDate || !endDate || dailyROIPercentage === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ success: false, message: "endDate must be after startDate" });
    }

    const investment = await Investment.create({
      user: req.user.id,
      investmentAmount,
      planDetails,
      startDate,
      endDate,
      dailyROIPercentage,
      status: "Active",
    });

    return res.status(201).json({ success: true, message: "Investment created", data: investment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @route GET /api/investments
export const getUserInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, count: investments.length, data: investments });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
