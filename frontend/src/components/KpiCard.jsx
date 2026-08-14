const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value ?? 0);

const KpiCard = ({ label, value, accent = "neutral" }) => (
  <div className="bg-surface border border-line rounded-md px-5 py-[18px] shadow-[0_1px_2px_rgba(18,32,61,0.06),0_1px_12px_rgba(18,32,61,0.04)]">
    <div className="text-[12.5px] text-text-muted font-medium mb-2.5">{label}</div>
    <div className={"font-mono text-[22px] font-medium flex items-baseline gap-[3px] " + (accent === "gain" ? "text-gain" : "text-navy")}>
      <span className="text-sm text-text-muted">₹</span>
      {formatCurrency(value)}
    </div>
  </div>
);

export default KpiCard;
