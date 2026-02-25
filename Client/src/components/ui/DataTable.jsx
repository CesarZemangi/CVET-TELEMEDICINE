export default function DataTable({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = "No data found",
  rowKey = "id",
  onRowClick = null,
  striped = true,
  hover = true
}) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className={`table align-middle ${striped ? 'table-striped' : ''} ${hover ? 'table-hover' : ''} mb-0`}>
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key}
                style={{ width: col.width, textAlign: col.align || 'left' }}
                className={col.key === 'action' ? 'text-end pe-4' : col.key.includes('ps-') ? 'ps-4' : ''}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr 
              key={row[rowKey] || idx}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col) => (
                <td 
                  key={col.key}
                  style={{ textAlign: col.align || 'left' }}
                  className={col.key === 'action' ? 'text-end pe-4' : col.key === 'id' ? 'ps-4' : ''}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
