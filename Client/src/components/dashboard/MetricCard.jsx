export default function MetricCard({ label, value, icon }) {
  return (
    <div
      className="card border-0 shadow-sm h-100"
      style={{ backgroundColor: "#F5F5DC" }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="mb-1" style={{ color: "#6b4a2d" }}>
              {label}
            </p>
            <h4 className="fw-bold mb-0" style={{ color: "#A0522D" }}>
              {value}
            </h4>
          </div>

          {icon && (
            <i
              className={`bi ${icon}`}
              style={{ fontSize: "1.8rem", color: "#A0522D" }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
