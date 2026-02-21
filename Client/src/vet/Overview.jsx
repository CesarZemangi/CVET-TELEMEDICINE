import React, { useState, useEffect } from "react"
import { getVetDashboardData, getVetRecentActivity } from "./services/vet.dashboard.service"
import { getCases } from "./services/vet.cases.service"

export default function VetOverview() {
  const [data, setData] = useState(null)
  const [cases, setCases] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashResult, casesResult, activityResult] = await Promise.all([
          getVetDashboardData(),
          getCases(),
          getVetRecentActivity()
        ])
        setData(dashResult)
        setCases(casesResult)
        setActivity(activityResult)
      } catch (error) {
        console.error("Error fetching vet data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="container-fluid py-4">

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-semibold mb-0">Vet Dashboard</h4>
      </div>

      {/* Summary Stats */}
      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-1 small uppercase fw-bold">Incoming Cases</p>
              <h4 className="fw-bold mb-0 text-primary">{data?.incomingCases || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-1 small uppercase fw-bold">Appts Today</p>
              <h4 className="fw-bold mb-0 text-success">{data?.appointmentsToday || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-1 small uppercase fw-bold">Ongoing Treatments</p>
              <h4 className="fw-bold mb-0 text-warning">{data?.ongoingTreatments || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-1 small uppercase fw-bold">Total Consultations</p>
              <h4 className="fw-bold mb-0 text-info">{data?.totalConsultations || 0}</h4>
            </div>
          </div>
        </div>

      </div>

      <div className="row g-4">
        {/* Work Queues */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Recent Incoming Cases</h6>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.length > 0 ? cases.slice(0, 5).map(c => (
                      <tr key={c.id}>
                        <td>{c.title || 'Untitled Case'}</td>
                        <td><span className={`badge ${c.status === 'open' ? 'bg-danger' : 'bg-success'}`}>{c.status}</span></td>
                        <td>{new Date(c.created_at).toLocaleDateString()}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="text-center text-muted">No cases found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Recent Activity</h6>
              <ul className="list-group list-group-flush">
                {activity.length > 0 ? activity.map((act, i) => (
                  <li key={i} className="list-group-item px-0 border-0 mb-2">
                    <div className="small fw-semibold">{act.message}</div>
                    <div className="text-muted x-small">{new Date(act.date).toLocaleString()}</div>
                  </li>
                )) : (
                  <li className="list-group-item px-0 border-0 text-muted">No recent activity</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
