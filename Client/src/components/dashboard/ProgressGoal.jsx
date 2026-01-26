export default function ProgressGoal({ label, value }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between mb-1">
        <small style={{ color: "#6b4a2d" }}>{label}</small>
        <small style={{ color: "#6b4a2d" }}>{value}%</small>
      </div>

      <div className="progress" style={{ height: "8px" }}>
        <div
          className="progress-bar"
          style={{
            width: `${value}%`,
            backgroundColor: "#A0522D"
          }}
        />
      </div>
    </div>
  )
}
