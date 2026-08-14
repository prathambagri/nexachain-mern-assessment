import express from "express";
import { getDirectReferrals, getReferralTree } from "../controllers/referralController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/direct", protect, getDirectReferrals);
router.get("/tree", protect, getReferralTree);

export default router;
