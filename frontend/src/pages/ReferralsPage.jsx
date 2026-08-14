import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import ReferralTree from "../components/ReferralTree";
import PageHeader from "../components/PageHeader";
import StateMessage from "../components/StateMessage";
import StatusPill from "../components/StatusPill";
import { getDirectReferrals, getReferralTree, getReferralIncomeHistory } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const SectionTitle = ({ children, className = "" }) => (
  <div className={"font-display text-[13px] font-semibold text-navy mb-1.5 px-1 " + className}>{children}</div>
);

const ReferralsPage = () => {
  const { user } = useAuth();
  const [direct, setDirect] = useState([]);
  const [tree, setTree] = useState(null);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [directRes, treeRes, incomeRes] = await Promise.all([
          getDirectReferrals(),
          getReferralTree(),
          getReferralIncomeHistory(),
        ]);
        if (cancelled) return;
        setDirect(directRes.data.data);
        setTree(treeRes.data.data);
        setIncome(incomeRes.data.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load referral data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const directColumns = [
    { key: "fullName", label: "Name" },
    { key: "referralCode", label: "Referral Code", mono: true },
    { key: "accountStatus", label: "Status", render: (row) => <StatusPill status={row.accountStatus} /> },
    { key: "createdAt", label: "Joined", render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") },
  ];

  const incomeColumns = [
    { key: "date", label: "Date", render: (row) => new Date(row.date).toLocaleDateString("en-IN") },
    { key: "referralLevel", label: "Level", render: (row) => `L${row.referralLevel}` },
    { key: "incomeAmount", label: "Income", mono: true, render: (row) => `₹${row.incomeAmount.toFixed(2)}` },
  ];

  return (
    <>
      <PageHeader
        title="Referrals"
        subtitle={
          <>
            Your referral code: <strong className="font-mono">{user?.referralCode}</strong> — share it to grow your downline.
          </>
        }
      />

      <SectionTitle>Referral tree</SectionTitle>
      {loading ? (
        <StateMessage>Loading…</StateMessage>
      ) : error ? (
        <StateMessage error>{error}</StateMessage>
      ) : (
        <ReferralTree root={tree} />
      )}

      <SectionTitle className="mt-7">Direct referrals</SectionTitle>
      <DataTable columns={directColumns} rows={direct} loading={loading} error={error} emptyLabel="No direct referrals yet." />

      <SectionTitle className="mt-7">Referral income history</SectionTitle>
      <DataTable columns={incomeColumns} rows={income} loading={loading} error={error} emptyLabel="No referral income credited yet." />
    </>
  );
};

export default ReferralsPage;
