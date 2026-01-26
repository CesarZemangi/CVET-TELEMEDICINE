export default function VetSettings() {
  return (
    <div className="container-fluid">

      <div className="mb-4">
        <h4 className="fw-semibold">Settings</h4>
        <p className="text-muted mb-0">
          Manage professional profile
        </p>
      </div>

      <div className="row g-4">

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">
                Profile Information
              </h6>

              <input
                type="text"
                className="form-control mb-3"
                value="Dr. Kumar"
              />

              <input
                type="text"
                className="form-control mb-3"
                value="Veterinary Surgeon"
              />

              <button className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">
                Availability
              </h6>

              <select className="form-select mb-3">
                <option>Available</option>
                <option>Busy</option>
              </select>

              <button className="btn btn-success">
                Update Status
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
