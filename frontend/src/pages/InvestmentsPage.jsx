import { useEffect, useState, useCallback } from "react";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import StatusPill from "../components/StatusPill";
import { getUserInvestments, createInvestment } from "../api/endpoints";

const emptyForm = { investmentAmount: "", planDetails: "", startDate: "", endDate: "", dailyROIPercentage: "" };
const inputClass = "border border-line rounded-md px-2.5 py-2 text-[13.5px] bg-bg text-text focus:border-accent focus:outline-none focus:bg-surface";
const labelClass = "flex flex-col gap-1.5 text-[12.5px] font-medium text-navy";

const InvestmentsPage = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadInvestments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUserInvestments();
      setInvestments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load investments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvestments();
  }, [loadInvestments]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await createInvestment({
        investmentAmount: Number(form.investmentAmount),
        planDetails: form.planDetails,
        startDate: form.startDate,
        endDate: form.endDate,
        dailyROIPercentage: Number(form.dailyROIPercentage),
      });
      setForm(emptyForm);
      await loadInvestments();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not create investment.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "planDetails", label: "Plan" },
    {
      key: "investmentAmount",
      label: "Amount",
      mono: true,
      render: (row) => `₹${row.investmentAmount.toLocaleString("en-IN")}`,
    },
    { key: "dailyROIPercentage", label: "Daily ROI %", mono: true, render: (row) => `${row.dailyROIPercentage}%` },
    { key: "startDate", label: "Start", render: (row) => new Date(row.startDate).toLocaleDateString("en-IN") },
    { key: "endDate", label: "End", render: (row) => new Date(row.endDate).toLocaleDateString("en-IN") },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <>
      <PageHeader title="Investments" subtitle="Create a new investment plan and track your active positions." />

      <form className="bg-surface border border-line rounded-md px-[22px] py-5 shadow-[0_1px_2px_rgba(18,32,61,0.06),0_1px_12px_rgba(18,32,61,0.04)] mb-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 max-md:grid-cols-2 gap-3.5 mb-3.5">
          <label className={labelClass}>
            Plan details
            <input required value={form.planDetails} onChange={handleChange("planDetails")} placeholder="e.g. Growth Plan 90D" className={inputClass} />
          </label>
          <label className={labelClass}>
            Investment amount (₹)
            <input required type="number" min="0" step="0.01" value={form.investmentAmount} onChange={handleChange("investmentAmount")} placeholder="10000" className={inputClass} />
          </label>
          <label className={labelClass}>
            Daily ROI %
            <input required type="number" min="0" step="0.01" value={form.dailyROIPercentage} onChange={handleChange("dailyROIPercentage")} placeholder="1.5" className={inputClass} />
          </label>
          <label className={labelClass}>
            Start date
            <input required type="date" value={form.startDate} onChange={handleChange("startDate")} className={inputClass} />
          </label>
          <label className={labelClass}>
            End date
            <input required type="date" value={form.endDate} onChange={handleChange("endDate")} className={inputClass} />
          </label>
        </div>

        {formError && <p className="text-loss text-[13px] m-0 mb-3.5" role="alert">{formError}</p>}

        <button
          type="submit"
          className="bg-accent text-white border-none rounded-md px-[18px] py-2.5 font-semibold text-[13.5px] hover:bg-[#2c56e0] transition-colors disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Creating…" : "Create investment"}
        </button>
      </form>

      <DataTable columns={columns} rows={investments} loading={loading} error={error} emptyLabel="No investments yet. Create your first one above." />
    </>
  );
};

export default InvestmentsPage;
