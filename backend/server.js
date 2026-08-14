import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { startROICronJob } from "./services/cronService.js";

import authRoutes from "./routes/authRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api", historyRoutes); // /api/roi-history, /api/referral-income

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startROICronJob();
  });
});
