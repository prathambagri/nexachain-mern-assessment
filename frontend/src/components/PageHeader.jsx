const PageHeader = ({ title, subtitle }) => (
  <div className="mb-7">
    <h1 className="font-display text-2xl text-navy m-0 tracking-tight">{title}</h1>
    {subtitle && <p className="text-text-muted text-sm mt-1 mb-0">{subtitle}</p>}
  </div>
);

export default PageHeader;
