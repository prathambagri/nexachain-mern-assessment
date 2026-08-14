const STATUS_STYLES = {
  Active: "bg-gain/10 text-gain",
  Credited: "bg-gain/10 text-gain",
  Completed: "bg-accent/10 text-accent",
  Cancelled: "bg-loss/10 text-loss",
  Failed: "bg-loss/10 text-loss",
  Pending: "bg-text-muted/10 text-text-muted",
};

const StatusPill = ({ status }) => (
  <span className={"inline-block px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold " + (STATUS_STYLES[status] || STATUS_STYLES.Pending)}>
    {status}
  </span>
);

export default StatusPill;
