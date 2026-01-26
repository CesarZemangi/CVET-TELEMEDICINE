export default function HealthCoverage() {
  return (
    <div className="container-fluid">
      <h4 className="fw-semibold mb-3">Health Coverage</h4>

      <div className="row g-3">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h6>Vaccinated Animals</h6>
              <h3 className="fw-bold">18</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h6>Dewormed</h6>
              <h3 className="fw-bold">12</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h6>Pending Care</h6>
              <h3 className="fw-bold">4</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h6>Regular Checkups</h6>
              <h3 className="fw-bold">9</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h6>Under Observation</h6>
              <h3 className="fw-bold">6</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h6>Critical Cases</h6>
              <h3 className="fw-bold">2</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h6>Recovered Animals</h6>
              <h3 className="fw-bold">15</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
