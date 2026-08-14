import cron from "node-cron";
import { processDailyROIForAllActiveInvestments } from "./roiService.js";

// Runs every day at midnight. Idempotency comes from the unique index
// on ROIHistory, so a duplicate run just skips already-credited investments.
export const startROICronJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log(`[CRON] Daily ROI job started at ${new Date().toISOString()}`);
    try {
      const results = await processDailyROIForAllActiveInvestments();
      const credited = results.filter((r) => !r.skipped && !r.error).length;
      const skipped = results.filter((r) => r.skipped).length;
      const failed = results.filter((r) => r.error).length;
      console.log(`[CRON] Daily ROI job finished. Credited: ${credited}, Skipped(dup): ${skipped}, Failed: ${failed}`);
    } catch (error) {
      console.error("[CRON] Daily ROI job failed:", error.message);
    }
  });

  console.log("Daily ROI cron job scheduled for 12:00 AM.");
};
