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

  const [caseData, setCaseData] = useState({ labels: [], datasets: [] })
  const [weeklyTrend, setWeeklyTrend] = useState({ labels: [], datasets: [] })

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    const validateChartData = (data) => data && data.labels && data.values;

    fetch("http://localhost:5000/api/vet/metrics", { headers })
      .then(res => res.json())
      .then(data => setMetrics(prev => ({ ...prev, ...data })))
      .catch(err => console.error("Metrics Fetch Error:", err))

    fetch("http://localhost:5000/api/vet/cases", { headers })
      .then(res => res.json())
      .then(data => {
        if (validateChartData(data)) {
          setCaseData({
            labels: data.labels,
            datasets: [{
              data: data.values,
              backgroundColor: ["#3ac47d", "#f7b924", "#d92550"]
            }]
          });
        }
      })
      .catch(err => console.error("Cases Fetch Error:", err))

    fetch("http://localhost:5000/api/vet/weekly-trend", { headers })
      .then(res => res.json())
      .then(data => {
        if (validateChartData(data)) {
          setWeeklyTrend({
            labels: data.labels,
            datasets: [{
              label: "Consultations",
              data: data.values,
              borderColor: "#f67280",
              backgroundColor: "rgba(246, 114, 128, 0.2)",
              fill: true,
              tension: 0.4 
            }]
          });
        }
      })
      .catch(err => console.error("Trend Fetch Error:", err))
  }, [])

  return (
    <div className="container-fluid py-4 bg-light">
      {/* Header Info Line */}
      <div className="mb-4">
        <h3 className="fw-bold">Vet Overview Dashboard</h3>
        <p className="text-muted small">Real-time diagnostics and consultation analytics.</p>
      </div>

      <div className="row g-4 mb-4">
        {/* Metric Cards with Custom Colors inspired by the image */}
        <div className="col-md-3">
          <MetricCard 
            label="Incoming Cases" 
            value={metrics.incomingCases} 
            className="bg-info text-white shadow-sm border-0" 
            subText="+ 5.4% from last week"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Daily Appointments" 
            value={metrics.appointmentsToday} 
            className="bg-primary text-white shadow-sm border-0"
            subText="+ 12.1% total"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Active Treatments" 
            value={metrics.ongoingTreatments} 
            className="bg-success text-white shadow-sm border-0"
            subText="72% Target"
          />
        </div>
        <div className="col-md-3">
          <MetricCard 
            label="Reports" 
            value={metrics.reportsSubmitted} 
            className="bg-danger text-white shadow-sm border-0"
            subText="-2.3% delay"
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Main Area: Hero Chart Section */}
        <div className="col-lg-8">
          <AnimatedSection>
            <div className="card border-0 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold">Consultation Trend Metrics</h5>
                <span className="badge bg-dark">Weekly View</span>
              </div>
              <div className="row">
                {/* Secondary Stats in Chart */}
                <div className="col-md-4 border-end">
                   <div className="mb-3">
                      <small className="text-muted d-block text-uppercase small">Efficiency</small>
                      <span className="h4 fw-bold text-success">83%</span>
                      <div className="progress mt-2" style={{height: "4px"}}>
                        <div className="progress-bar bg-success" style={{width: "83%"}}></div>
                      </div>
                   </div>
                   <div className="mb-3">
                      <small className="text-muted d-block text-uppercase small">Case Resolution</small>
                      <span className="h4 fw-bold text-primary">71%</span>
                      <div className="progress mt-2" style={{height: "4px"}}>
                        <div className="progress-bar bg-primary" style={{width: "71%"}}></div>
                      </div>
                   </div>
                </div>
                {/* The Chart */}
                <div className="col-md-8">
                  {weeklyTrend.labels.length > 0 ? (
                    <ChartWrapper type="line" data={weeklyTrend} />
                  ) : (
                    <p className="text-center py-5 text-muted">Awaiting stream data...</p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Sidebar Area: Case Distribution */}
        <div className="col-lg-4">
          <AnimatedSection delay={0.1}>
            <div className="card border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-4">Distribution Analysis</h5>
              {caseData.labels.length > 0 ? (
                <div className="text-center">
                  <ChartWrapper type="pie" data={caseData} options={{ maintainAspectRatio: false }} />
                  <div className="mt-4 text-start">
                    <small className="text-muted d-block">Status Overview</small>
                    <div className="d-flex justify-content-between py-1 border-bottom">
                      <span>Resolved</span> <span className="text-success fw-bold">71%</span>
                    </div>
                    <div className="d-flex justify-content-between py-1 border-bottom">
                      <span>In-Progress</span> <span className="text-warning fw-bold">19%</span>
                    </div>
                    <div className="d-flex justify-content-between py-1">
                      <span>Critical</span> <span className="text-danger fw-bold">10%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-5 text-muted">Data sync in progress...</p>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}