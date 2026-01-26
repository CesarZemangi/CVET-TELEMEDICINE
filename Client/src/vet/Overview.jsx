export default function VetOverview() {
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
              <p className="text-muted mb-1">Appointments Today</p>
              <h4 className="fw-bold">63%</h4>
              <div className="progress">
                <div className="progress-bar bg-primary" style={{ width: "63%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Treatment Success</p>
              <h4 className="fw-bold">32%</h4>
              <div className="progress">
                <div className="progress-bar bg-success" style={{ width: "32%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">New Patients</p>
              <h4 className="fw-bold">71%</h4>
              <div className="progress">
                <div className="progress-bar bg-info" style={{ width: "71%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Medication Usage</p>
              <h4 className="fw-bold">32%</h4>
              <div className="progress">
                <div className="progress-bar bg-danger" style={{ width: "32%" }}></div>
              </div>
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
                    <th>Farmer</th>
                    <th>Priority</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cow</td>
                    <td>Loss of appetite</td>
                    <td>Ramesh</td>
                    <td><span className="badge bg-danger">High</span></td>
                    <td>
                      <button className="btn btn-sm btn-primary">Respond</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Goat</td>
                    <td>Limping</td>
                    <td>Suresh</td>
                    <td><span className="badge bg-warning text-dark">Medium</span></td>
                    <td>
                      <button className="btn btn-sm btn-primary">Respond</button>
                    </td>
                  </tr>
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
                    <th>Farmer</th>
                    <th>Animal</th>
                    <th>Time</th>
                    <th>Mode</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Anita</td>
                    <td>Cow</td>
                    <td>10:30 AM</td>
                    <td>Video</td>
                  </tr>
                  <tr>
                    <td>Mahesh</td>
                    <td>Sheep</td>
                    <td>12:00 PM</td>
                    <td>Chat</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
