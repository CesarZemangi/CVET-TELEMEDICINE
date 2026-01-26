export default function Settings() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Account Settings</h4>
        <small className="text-muted">
          Manage your personal and security information
        </small>
      </div>

      <div className="row g-4">

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">

              <h6 className="fw-semibold mb-3">
                Profile Information
              </h6>

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value="Farmer Name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  value="9876543210"
                />
              </div>

              <button className="btn btn-primary">
                Save Profile
              </button>

            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">

              <h6 className="fw-semibold mb-3">
                Security Settings
              </h6>

              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                />
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  Update Password
                </button>
                <button className="btn btn-danger">
                  Logout
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
