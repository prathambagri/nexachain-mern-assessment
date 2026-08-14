import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import StateMessage from "./StateMessage";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

/**
 * Builds a cumulative earnings series (ROI + level income) grouped by day,
 * from the raw ROI history and referral income history lists.
 */
const buildSeries = (roiHistory = [], referralIncome = []) => {
  const byDate = new Map();

  roiHistory.forEach((r) => {
    const key = new Date(r.date).toISOString().slice(0, 10);
    byDate.set(key, (byDate.get(key) || 0) + r.roiAmount);
  });

  referralIncome.forEach((r) => {
    const key = new Date(r.date).toISOString().slice(0, 10);
    byDate.set(key, (byDate.get(key) || 0) + r.incomeAmount);
  });

  const sortedDates = Array.from(byDate.keys()).sort();

  let cumulative = 0;
  return sortedDates.map((date) => {
    cumulative += byDate.get(date);
    return { date, cumulative: Number(cumulative.toFixed(2)) };
  });
};

const EarningsChart = ({ roiHistory, referralIncome }) => {
  const data = buildSeries(roiHistory, referralIncome);

  if (data.length === 0) {
    return <StateMessage>No earnings recorded yet — the chart fills in once ROI or referral income is credited.</StateMessage>;
  }

  return (
    <div className="bg-surface border border-line rounded-md px-[18px] pt-[18px] pb-1.5 shadow-[0_1px_2px_rgba(18,32,61,0.06),0_1px_12px_rgba(18,32,61,0.04)] mb-7">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D6BFF" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#3D6BFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E3E7EF" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={{ stroke: "#E3E7EF" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            labelFormatter={formatDate}
            formatter={(value) => [`₹${value}`, "Cumulative earnings"]}
            contentStyle={{ borderRadius: 8, border: "1px solid #E3E7EF", fontSize: 12.5 }}
          />
          <Area type="monotone" dataKey="cumulative" stroke="#3D6BFF" strokeWidth={2} fill="url(#earningsFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
