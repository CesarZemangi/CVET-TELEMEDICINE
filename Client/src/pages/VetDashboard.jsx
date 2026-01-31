import { useState, useEffect } from "react"
import DashboardSection from "../components/dashboard/DashboardSection"
import MetricCard from "../components/dashboard/MetricCard"
import ChartWrapper from "../components/dashboard/ChartWrapper"
import AnimatedSection from "../components/ui/AnimatedSection"

export default function VetDashboard() {
  const [metrics, setMetrics] = useState({
    incomingCases: 0,
    appointmentsToday: 0,
    ongoingTreatments: 0,
    reportsSubmitted: 0
  })

  const [caseData, setCaseData] = useState({
    labels: [],
    datasets: []
  })

  const [weeklyTrend, setWeeklyTrend] = useState({
    labels: [],
    datasets: []
  })

  useEffect(() => {
    fetch("http://localhost:5000/api/vet/metrics")
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error(err))

    fetch("http://localhost:5000/api/vet/cases")
      .then(res => res.json())
      .then(data =>
        setCaseData({
          labels: data.labels,
          datasets: [
            {
              data: data.values,
              backgroundColor: ["#A0522D", "#c19a6b", "#8B4513"]
            }
          ]
        })
      )
      .catch(err => console.error(err))

    fetch("http://localhost:5000/api/vet/weekly-trend")
      .then(res => res.json())
      .then(data =>
        setWeeklyTrend({
          labels: data.labels,
          datasets: [
            {
              data: data.values,
              borderColor: "#A0522D",
              backgroundColor: "#F5F5DC"
            }
          ]
        })
      )
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="container-fluid py-4">

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <MetricCard label="Incoming Cases" value={metrics.incomingCases} />
        </div>
        <div className="col-md-3">
          <MetricCard label="Appointments Today" value={metrics.appointmentsToday} />
        </div>
        <div className="col-md-3">
          <MetricCard label="Ongoing Treatments" value={metrics.ongoingTreatments} />
        </div>
        <div className="col-md-3">
          <MetricCard label="Reports Submitted" value={metrics.reportsSubmitted} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <AnimatedSection>
            <DashboardSection title="Case Distribution">
              <ChartWrapper type="pie" data={caseData} />
            </DashboardSection>
          </AnimatedSection>
        </div>

        <div className="col-lg-6">
          <AnimatedSection delay={0.1}>
            <DashboardSection title="Weekly Consultation Trend">
              <ChartWrapper type="line" data={weeklyTrend} />
            </DashboardSection>
          </AnimatedSection>
        </div>
      </div>

    </div>
  )
}
