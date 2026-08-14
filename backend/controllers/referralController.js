import mongoose from "mongoose";
import User from "../models/User.js";

// @route GET /api/referrals/direct
export const getDirectReferrals = async (req, res) => {
  try {
    const directReferrals = await User.find({ referredBy: req.user.id })
      .select("fullName email referralCode accountStatus createdAt")
      .lean();

    return res.status(200).json({ success: true, count: directReferrals.length, data: directReferrals });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @route GET /api/referrals/tree
// $graphLookup walks the referredBy chain server-side and returns the
// whole downline in one query, tagged with depth level.
export const getReferralTree = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const result = await User.aggregate([
      { $match: { _id: userId } },
      {
        $graphLookup: {
          from: "users",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "referredBy",
          as: "downline",
          depthField: "level",
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          referralCode: 1,
          "downline._id": 1,
          "downline.fullName": 1,
          "downline.email": 1,
          "downline.referralCode": 1,
          "downline.referredBy": 1,
          "downline.level": 1,
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const root = result[0];
    const flatDownline = root.downline || [];

    // build nested tree from the flat downline list
    const nodesById = new Map();
    flatDownline.forEach((u) => {
      nodesById.set(String(u._id), {
        id: u._id,
        fullName: u.fullName,
        email: u.email,
        referralCode: u.referralCode,
        referredBy: u.referredBy,
        children: [],
      });
    });

    const tree = [];
    nodesById.forEach((node) => {
      const parentId = String(node.referredBy);
      if (nodesById.has(parentId)) {
        nodesById.get(parentId).children.push(node);
      } else {
        // Direct referral of the root user
        tree.push(node);
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        id: root._id,
        fullName: root.fullName,
        email: root.email,
        referralCode: root.referralCode,
        children: tree,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
