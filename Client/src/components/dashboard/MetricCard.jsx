export default function MetricCard({ label, value, icon, trend }) {
  return (
    <div className="card border-0 shadow-sm h-100 dashboard-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              width: "45px", 
              height: "45px", 
              background: "rgba(34, 139, 34, 0.1)",
              color: "var(--primary-green)"
            }}
          >
            <i className={`bi ${icon} fs-4`}></i>
          </div>
          {trend && (
            <span className={`badge ${trend.startsWith('+') ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-muted small fw-bold mb-1 text-uppercase tracking-wider">
            {label}
          </p>
          <h3 className="fw-bold mb-0" style={{ color: "var(--text-dark)" }}>
            {value}
          </h3>
        </div>
      </div>
    </div>
  )
}
