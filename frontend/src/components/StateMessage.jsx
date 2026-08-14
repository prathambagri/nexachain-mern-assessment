const StateMessage = ({ children, error = false }) => (
  <div
    className={
      "p-10 text-center text-sm bg-surface rounded-md border border-line " +
      (error ? "text-loss" : "text-text-muted")
    }
  >
    {children}
  </div>
);

export default StateMessage;
