export default function FarmerOverview() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Farmer Dashboard</h4>
        <small className="text-muted">
          Overview of your livestock health activity
        </small>
      </div>

      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-file-earmark-medical fs-3 text-success me-3"></i>
                <div>
                  <small className="text-muted">Total Cases Raised</small>
                  <h4 className="fw-bold mb-0">12</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-hourglass-split fs-3 text-warning me-3"></i>
                <div>
                  <small className="text-muted">Pending Consultations</small>
                  <h4 className="fw-bold mb-0">3</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-chat-dots fs-3 text-primary me-3"></i>
                <div>
                  <small className="text-muted">Vet Responses</small>
                  <h4 className="fw-bold mb-0">8</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle fs-3 text-success me-3"></i>
                <div>
                  <small className="text-muted">Resolved Cases</small>
                  <h4 className="fw-bold mb-0">6</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <h6 className="fw-semibold mb-3">
            Recent Activity
          </h6>

          <ul className="list-group list-group-flush">

            <li className="list-group-item d-flex justify-content-between">
              <span>
                Case submitted for Cow with fever symptoms
              </span>
              <small className="text-muted">Today</small>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <span>
                Vet Dr. Kumar responded to Goat limping case
              </span>
              <small className="text-muted">Yesterday</small>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <span>
                Video consultation scheduled for Cow treatment
              </span>
              <small className="text-muted">2 days ago</small>
            </li>

          </ul>

        </div>
      </div>

    </div>
  )
}
