import DashboardSection from "../components/dashboard/DashboardSection"
import MetricCard from "../components/dashboard/MetricCard"
import ChartWrapper from "../components/dashboard/ChartWrapper"
import AnimatedSection from "../components/ui/AnimatedSection"

export default function VetDashboard() {
  const caseData = {
    labels: ["Resolved", "Pending", "Critical"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ["#A0522D", "#c19a6b", "#8B4513"]
      }
    ]
  }

  return (
    <div className="container-fluid py-4">

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <MetricCard label="Incoming Cases" value="58" icon="bi-inbox" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Appointments Today" value="12" icon="bi-calendar" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Ongoing Treatments" value="21" icon="bi-heart" />
        </div>
        <div className="col-md-3">
          <MetricCard label="Reports Submitted" value="16" icon="bi-clipboard-data" />
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
              <ChartWrapper
                type="line"
                data={{
                  labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
                  datasets: [
                    {
                      data: [10, 14, 9, 18, 22, 17],
                      borderColor: "#A0522D",
                      backgroundColor: "#F5F5DC"
                    }
                  ]
                }}
              />
            </DashboardSection>
          </AnimatedSection>
        </div>
      </div>

    </div>
  )
}
