// Generic sortable table.
// columns: [{ key: 'name', label: 'Name', sortable: true }, ...]
// data: array of row objects
// sortBy/order: current sort state (lifted up to the parent)
// onSortChange(key): called when a sortable header is clicked
export default function DataTable({ columns, data, sortBy, order, onSortChange }) {
  const arrow = (key) => {
    if (sortBy !== key) return '';
    return order === 'desc' ? ' ▼' : ' ▲';
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              onClick={() => col.sortable && onSortChange(col.key)}
              style={{ cursor: col.sortable ? 'pointer' : 'default' }}
            >
              {col.label}
              {col.sortable && arrow(col.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id ?? i}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length}>No results</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
