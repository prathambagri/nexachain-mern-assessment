import Investment from "../models/Investment.js";
import ROIHistory from "../models/ROIHistory.js";
import User from "../models/User.js";
import { distributeLevelIncome } from "./referralIncomeService.js";

// Normalize to midnight UTC so the (investment, date) unique index
// catches duplicate credits for the same day regardless of run time.
const getDayStart = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// Credits daily ROI for one investment. We insert the history record
// first - the unique (investment, date) index rejects it if today's
// ROI was already credited, so we never touch the wallet twice.
export const processDailyROIForInvestment = async (investment) => {
  const today = getDayStart();
  const roiAmount = (investment.investmentAmount * investment.dailyROIPercentage) / 100;

  try {
    await ROIHistory.create({
      user: investment.user,
      investment: investment._id,
      roiAmount,
      date: today,
      status: "Credited",
    });
  } catch (error) {
    if (error.code === 11000) {
      return { skipped: true, investmentId: investment._id, reason: "Already credited for this date" };
    }
    throw error;
  }

  await User.findByIdAndUpdate(investment.user, {
    $inc: { walletBalance: roiAmount, totalROIEarned: roiAmount },
  });

  // credit referral/level income for the upline based on this ROI
  await distributeLevelIncome(investment.user, roiAmount, today);

  return { skipped: false, investmentId: investment._id, roiAmount };
};

// Runs daily ROI for every active investment. Called by the cron job.
export const processDailyROIForAllActiveInvestments = async () => {
  const activeInvestments = await Investment.find({ status: "Active" }).lean();

  const results = [];
  for (const investment of activeInvestments) {
    try {
      const result = await processDailyROIForInvestment(investment);
      results.push(result);

      if (new Date(investment.endDate) <= new Date()) {
        await Investment.findByIdAndUpdate(investment._id, { status: "Completed" });
      }
    } catch (error) {
      results.push({ skipped: false, investmentId: investment._id, error: error.message });
    }
  }

  return results;
};
