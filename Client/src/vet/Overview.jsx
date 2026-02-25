import React, { useState, useEffect } from "react"
import { getVetDashboardData, getVetRecentActivity } from "./services/vet.dashboard.service"
import { getCases } from "./services/vet.cases.service"

export default function VetOverview() {
  const [data, setData] = useState({
    incomingCases: 0,
    appointmentsToday: 0,
    ongoingTreatments: 0,
    totalConsultations: 0,
    statusDistribution: [],
    weeklyActivity: []
  })
  const [cases, setCases] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [dashResult, casesResult, activityResult] = await Promise.all([
          getVetDashboardData(),
          getCases(),
          getVetRecentActivity()
        ])
        
        console.log("Dashboard data:", dashResult)
        console.log("Cases:", casesResult)
        console.log("Activity:", activityResult)
        
        setData(dashResult?.data || {
          incomingCases: 0,
          appointmentsToday: 0,
          ongoingTreatments: 0,
          totalConsultations: 0
        })
        
        setCases(Array.isArray(casesResult) ? casesResult : casesResult?.data || [])
        setActivity(Array.isArray(activityResult) ? activityResult : activityResult?.data || [])
      } catch (error) {
        console.error("Error fetching vet data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  if (error) return (
    <div className="container-fluid py-4">
      <div className="alert alert-danger" role="alert">
        <strong>Error loading dashboard:</strong> {error}
      </div>
    </div>
  )

  return (
    <div className="container-fluid py-4">

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-semibold mb-0">Vet Dashboard</h4>
      </div>

      {/* Summary Stats */}
      <div className="row g-3 mb-4">

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ 
                    width: "50px", 
                    height: "50px", 
                    background: "rgba(13, 110, 253, 0.1)",
                    color: "#0d6efd"
                  }}
                >
                  <i className="bi bi-folder-open fs-5"></i>
                </div>
                <div>
                  <p className="text-muted mb-0 small fw-semibold">Open Cases</p>
                  <h4 className="fw-bold mb-0 text-primary">{data?.incomingCases || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ 
                    width: "50px", 
                    height: "50px", 
                    background: "rgba(40, 167, 69, 0.1)",
                    color: "#28a745"
                  }}
                >
                  <i className="bi bi-calendar-check fs-5"></i>
                </div>
                <div>
                  <p className="text-muted mb-0 small fw-semibold">Consultations</p>
                  <h4 className="fw-bold mb-0 text-success">{data?.appointmentsToday || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ 
                    width: "50px", 
                    height: "50px", 
                    background: "rgba(255, 193, 7, 0.1)",
                    color: "#ffc107"
                  }}
                >
                  <i className="bi bi-activity fs-5"></i>
                </div>
                <div>
                  <p className="text-muted mb-0 small fw-semibold">Ongoing Cases</p>
                  <h4 className="fw-bold mb-0 text-warning">{data?.ongoingTreatments || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ 
                    width: "50px", 
                    height: "50px", 
                    background: "rgba(23, 162, 184, 0.1)",
                    color: "#17a2b8"
                  }}
                >
                  <i className="bi bi-chat-dots fs-5"></i>
                </div>
                <div>
                  <p className="text-muted mb-0 small fw-semibold">Total Consults</p>
                  <h4 className="fw-bold mb-0 text-info">{data?.totalConsultations || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="row g-4">
        {/* Recent Cases */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-folder-open me-2 text-primary"></i>Recent Assigned Cases
              </h6>
            </div>
            <div className="card-body p-0">
              {cases.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Case Title</th>
                        <th>Status</th>
                        <th className="text-end pe-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cases.slice(0, 5).map(c => (
                        <tr key={c.id}>
                          <td className="ps-4">
                            <div className="fw-semibold">{c.title || 'Untitled Case'}</div>
                            <small className="text-muted">#{c.id}</small>
                          </td>
                          <td>
                            <span className={`badge ${c.status === 'open' ? 'bg-warning text-dark' : 'bg-success'}`}>
                              {c.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-end pe-4 small text-muted">{new Date(c.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-5 text-center text-muted">
                  <i className="bi bi-inbox fs-3 d-block mb-2 opacity-50"></i>
                  <p className="mb-0">No cases assigned yet</p>
                </div>
              )}
            </div>
            {cases.length > 5 && (
              <div className="card-footer bg-white border-0 py-3 text-center">
                <small className="text-muted">Showing 5 of {cases.length} cases</small>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-bell me-2 text-success"></i>Recent Activity
              </h6>
            </div>
            <div className="card-body">
              {activity.length > 0 ? (
                <div className="timeline-list">
                  {activity.slice(0, 5).map((act, i) => (
                    <div key={i} className="mb-3 pb-3 border-bottom">
                      <div className="small fw-semibold text-dark">{act.message}</div>
                      <div className="text-muted x-small mt-1">
                        <i className="bi bi-clock-history me-1"></i>
                        {new Date(act.date).toLocaleString([], { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-3 d-block mb-2 opacity-50"></i>
                  <p className="mb-0 small">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
