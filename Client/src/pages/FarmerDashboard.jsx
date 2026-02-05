export default function FarmerDashboard() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Farmer Dashboard</h4>
        <small className="text-muted">
          Overview of your farm health and activities
        </small>
      </div>

      <div className="row g-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Total Animals</small>
              <h3 className="fw-bold mt-2">24</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Active Cases</small>
              <h3 className="fw-bold mt-2">5</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Pending Consultations</small>
              <h3 className="fw-bold mt-2">2</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Health Alerts</small>
              <h3 className="fw-bold mt-2 text-danger">1</h3>
            </div>
          </div>
        </div>

      </div>

      <div className="row mt-4">

        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Recent Activities</h6>

              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0">
                  New lab result uploaded for Cow Lakshmi
                </li>
                <li className="list-group-item px-0">
                  Consultation scheduled with Vet Arun
                </li>
                <li className="list-group-item px-0">
                  Vaccination completed for Goat Kannan
                </li>
              </ul>

            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Quick Actions</h6>

              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  Add Animal
                </button>
                <button className="btn btn-outline-primary btn-sm">
                  Create Case
                </button>
                <button className="btn btn-outline-primary btn-sm">
                  Request Consultation
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
