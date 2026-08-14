import User from "../models/User.js";
import ReferralIncome from "../models/ReferralIncome.js";

// Brief doesn't specify level income percentages, so these are assumed
// (documented in README): level 1 = 5%, level 2 = 3%, level 3 = 2%
const LEVEL_PERCENTAGES = [5, 3, 2];

// Walks up the referral chain from sourceUserId's parent, crediting each
// eligible ancestor a percentage of roiAmount based on their level.
export const distributeLevelIncome = async (sourceUserId, roiAmount, date = new Date()) => {
  let currentUser = await User.findById(sourceUserId).select("referredBy").lean();
  const creditedRecords = [];

  for (let level = 0; level < LEVEL_PERCENTAGES.length; level++) {
    if (!currentUser || !currentUser.referredBy) break;

    const parentId = currentUser.referredBy;
    const parent = await User.findById(parentId).select("referredBy accountStatus").lean();

    if (!parent) break;

    if (parent.accountStatus === "Active") {
      const incomeAmount = (roiAmount * LEVEL_PERCENTAGES[level]) / 100;

      await ReferralIncome.create({
        receiverUser: parentId,
        sourceUser: sourceUserId,
        referralLevel: level + 1,
        incomeAmount,
        date,
      });

      await User.findByIdAndUpdate(parentId, {
        $inc: { walletBalance: incomeAmount, totalLevelIncomeEarned: incomeAmount },
      });

      creditedRecords.push({ receiverUser: parentId, level: level + 1, incomeAmount });
    }

    currentUser = parent;
  }

  return creditedRecords;
};
