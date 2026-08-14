import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/investments", label: "Investments" },
  { to: "/dashboard/roi-history", label: "ROI History" },
  { to: "/dashboard/referrals", label: "Referrals" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-[236px] min-h-screen bg-navy text-text-inverse flex flex-col p-6 px-4 sticky top-0 max-md:w-full max-md:min-h-0 max-md:relative max-md:flex-row max-md:items-center max-md:p-3 max-md:px-4">
      <div className="flex items-center gap-2.5 px-2 mb-8 max-md:mb-0 max-md:mr-4">
        <span className="w-5 h-5 rounded-md shrink-0 bg-gradient-to-br from-accent to-[#8fb0ff]" aria-hidden="true" />
        <div>
          <div className="font-display font-semibold text-[13px] tracking-wide">NEXACHAIN AI</div>
          <div className="text-[11px] text-text-inverse/55 mt-px">Investor Ledger</div>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1 max-md:flex-row max-md:overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              "px-3 py-2.5 rounded-md text-sm font-medium no-underline transition-colors whitespace-nowrap " +
              (isActive
                ? "bg-accent/20 text-[#A9C0FF]"
                : "text-text-inverse/70 hover:bg-text-inverse/5 hover:text-text-inverse")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-text-inverse/10 pt-4 flex flex-col gap-2.5 max-md:hidden">
        <div>
          <div className="text-[13px] font-semibold">{user?.fullName || "Investor"}</div>
          <div className="font-mono text-[11px] text-text-inverse/50 mt-0.5">{user?.referralCode}</div>
        </div>
        <button
          className="bg-transparent border border-text-inverse/20 text-text-inverse/85 rounded-md py-2 text-xs font-medium hover:bg-text-inverse/10 transition-colors"
          onClick={logout}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
