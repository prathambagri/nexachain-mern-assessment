import { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import EarningsChart from "../components/EarningsChart";
import PageHeader from "../components/PageHeader";
import StateMessage from "../components/StateMessage";
import { getDashboard, getROIHistory, getReferralIncomeHistory } from "../api/endpoints";

const OverviewPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [roiHistory, setRoiHistory] = useState([]);
  const [referralIncome, setReferralIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [dashRes, roiRes, refRes] = await Promise.all([
          getDashboard(),
          getROIHistory(),
          getReferralIncomeHistory(),
        ]);
        if (cancelled) return;
        setDashboard(dashRes.data.data);
        setRoiHistory(roiRes.data.data);
        setReferralIncome(refRes.data.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Today's ROI, derived from roiHistory (the Dashboard API only returns cumulative totals)
  const todayKey = new Date().toISOString().slice(0, 10);
  const dailyROI = roiHistory
    .filter((r) => new Date(r.date).toISOString().slice(0, 10) === todayKey)
    .reduce((sum, r) => sum + r.roiAmount, 0);

  return (
    <>
      <PageHeader title="Overview" subtitle="Your investment ledger at a glance." />

      {loading && <StateMessage>Loading dashboard…</StateMessage>}
      {error && !loading && <StateMessage error>{error}</StateMessage>}

      {!loading && !error && dashboard && (
        <>
          <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4 mb-7">
            <KpiCard label="Total Investments" value={dashboard.totalInvestments} />
            <KpiCard label="Daily ROI" value={dailyROI} accent="gain" />
            <KpiCard label="Total Level Income" value={dashboard.totalLevelIncomeEarned} />
            <KpiCard label="Wallet Balance" value={dashboard.walletBalance} accent="gain" />
          </div>

          <div className="font-display text-[13px] font-semibold text-navy mb-1.5 px-1">
            Cumulative earnings (ROI + level income)
          </div>
          <EarningsChart roiHistory={roiHistory} referralIncome={referralIncome} />
        </>
      )}
    </>
  );
};

export default OverviewPage;
