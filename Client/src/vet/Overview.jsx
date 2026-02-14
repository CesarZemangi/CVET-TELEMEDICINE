import React, { useState, useEffect } from "react"
import { getDashboardData } from "./services/vet.dashboard.service"
import { getCases } from "./services/vet.cases.service"
import { getAppointments } from "./services/vet.appointments.service"

export default function VetOverview() {
  const [data, setData] = useState(null)
  const [cases, setCases] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashResult, casesResult, apptResult] = await Promise.all([
          getDashboardData(),
          getCases(),
          getAppointments()
        ])
        setData(dashResult)
        setCases(casesResult)
        setAppointments(apptResult)
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
    <div className="container-fluid">

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-semibold mb-0">Vet Dashboard</h4>
        <button className="btn btn-primary">
          Generate Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Incoming Cases</p>
              <h4 className="fw-bold">{data?.incomingCases || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Appointments Today</p>
              <h4 className="fw-bold">{data?.appointmentsToday || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Ongoing Treatments</p>
              <h4 className="fw-bold">{data?.ongoingTreatments || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Reports Submitted</p>
              <h4 className="fw-bold">{data?.reportsSubmitted || 0}</h4>
            </div>
          </div>
        </div>

      </div>

      {/* Highlight Metrics */}
      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <div className="card text-white bg-primary shadow-sm">
            <div className="card-body">
              <p className="mb-1">Patient Satisfaction</p>
              <h3 className="fw-bold">87.4%</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-purple shadow-sm" style={{ backgroundColor: "#6f42c1" }}>
            <div className="card-body">
              <p className="mb-1">Total Appointments</p>
              <h3 className="fw-bold">17.2k</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success shadow-sm">
            <div className="card-body">
              <p className="mb-1">Successful Treatments</p>
              <h3 className="fw-bold">63.2k</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-danger shadow-sm">
            <div className="card-body">
              <p className="mb-1">Monthly Expenses</p>
              <h3 className="fw-bold">45.8k</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Work Queues */}
      <div className="row g-4">

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Incoming Cases</h6>

              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Animal</th>
                    <th>Symptoms</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cases.length > 0 ? cases.map(c => (
                    <tr key={c.id}>
                      <td>{c.animal_type || 'N/A'}</td>
                      <td>{c.description || 'N/A'}</td>
                      <td><span className={`badge ${c.status === 'open' ? 'bg-danger' : 'bg-success'}`}>{c.status}</span></td>
                      <td>
                        <button className="btn btn-sm btn-primary">Respond</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center text-muted">No cases found</td></tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Today’s Appointments</h6>

              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? appointments.map(a => (
                    <tr key={a.id}>
                      <td>{a.subject || 'Consultation'}</td>
                      <td>{new Date(a.date).toLocaleString()}</td>
                      <td><span className="badge bg-info">{a.status || 'Scheduled'}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="text-center text-muted">No appointments found</td></tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
