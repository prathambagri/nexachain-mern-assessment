import StateMessage from "./StateMessage";

/**
 * columns: [{ key, label, mono?: bool, render?: (row) => node }]
 */
const DataTable = ({ columns, rows, loading, error, emptyLabel = "No records yet." }) => {
  if (loading) return <StateMessage>Loading…</StateMessage>;
  if (error) return <StateMessage error>{error}</StateMessage>;
  if (!rows || rows.length === 0) return <StateMessage>{emptyLabel}</StateMessage>;

  return (
    <div className="bg-surface border border-line rounded-md overflow-hidden shadow-[0_1px_2px_rgba(18,32,61,0.06),0_1px_12px_rgba(18,32,61,0.04)]">
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-[11.5px] uppercase tracking-wide text-text-muted font-semibold px-[18px] py-3 border-b border-line bg-[#FAFBFD]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row._id || idx} className="hover:bg-[#FAFBFD] last:[&>td]:border-b-0">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={"px-[18px] py-3 border-b border-line text-text " + (col.mono ? "font-mono" : "")}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
