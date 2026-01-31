import DashboardSection from "../../components/dashboard/DashboardSection";

export default function HealthMetrics() {
  const metrics = [
    { label: "Weight", value: "320 kg" },
    { label: "Milk Yield", value: "14 L/day" },
    { label: "Temperature", value: "38.5 °C", type: "temperature" },
    { label: "Heart Rate", value: "72 bpm" },
    { label: "Respiratory Rate", value: "18 breaths/min" },
    { label: "Hydration Level", value: "Optimal", type: "status" },
    { label: "Vaccination Status", value: "Up-to-date", type: "status" },
    { label: "Feed Intake", value: "25 kg/day" },
    { label: "Activity Level", value: "High", type: "status" },
    { label: "Stress Indicators", value: "Low", type: "status" },
    { label: "Disease Risk Score", value: "12%", type: "risk" },
    { label: "Recovery Index", value: "Strong", type: "status" }
  ]

  const getStyle = (metric) => {
    if (metric.type === "temperature") {
      const temp = parseFloat(metric.value)
      return temp > 39 ? "text-danger fw-bold" : "text-success"
    }
    if (metric.type === "risk") {
      const risk = parseFloat(metric.value)
      return risk > 20 ? "text-danger fw-bold" : "text-success"
    }
    if (metric.type === "status") {
      return ["Optimal", "Up-to-date", "High", "Low", "Strong"].includes(metric.value)
        ? "text-success"
        : "text-warning"
    }
    return ""
  }

  return (
    <DashboardSection title="Health Metrics (Zimbabwe)">
      <p className="mb-3">
        Dairy cow (Nguni breed) monitored in Mashonaland. Metrics reflect current health and productivity.
      </p>
      <div className="row">
        {metrics.map((metric, idx) => (
          <div key={idx} className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="card-title">{metric.label}</h6>
                <p className={`card-text ${getStyle(metric)}`}>{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardSection>
  )
}
