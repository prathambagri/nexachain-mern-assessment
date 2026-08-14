import express from "express";
import { getROIHistory, getReferralIncomeHistory } from "../controllers/historyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/roi-history", protect, getROIHistory);
router.get("/referral-income", protect, getReferralIncomeHistory);

export default router;
