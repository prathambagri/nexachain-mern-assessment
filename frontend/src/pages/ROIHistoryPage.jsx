import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import StatusPill from "../components/StatusPill";
import { getROIHistory } from "../api/endpoints";

const ROIHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getROIHistory();
        if (!cancelled) setHistory(res.data.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load ROI history.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const columns = [
    { key: "date", label: "Date", render: (row) => new Date(row.date).toLocaleDateString("en-IN") },
    { key: "roiAmount", label: "ROI Amount", mono: true, render: (row) => `₹${row.roiAmount.toFixed(2)}` },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <>
      <PageHeader title="ROI History" subtitle="Daily returns credited from your active investments." />
      <DataTable columns={columns} rows={history} loading={loading} error={error} emptyLabel="No ROI credited yet." />
    </>
  );
};

export default ROIHistoryPage;
