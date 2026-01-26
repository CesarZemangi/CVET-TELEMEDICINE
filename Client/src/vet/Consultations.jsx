export default function VetConsultations() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Consultations</h4>
        <small className="text-muted">
          Ongoing animal health consultations
        </small>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Case ID</th>
                <th>Farmer</th>
                <th>Animal</th>
                <th>Mode</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>#C014</td>
                <td>Ramesh</td>
                <td>Cow</td>
                <td>Video</td>
                <td>
                  <span className="badge bg-primary">
                    Active
                  </span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-primary me-2">
                    Continue
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    Notes
                  </button>
                </td>
              </tr>

              <tr>
                <td>#C011</td>
                <td>Anita</td>
                <td>Sheep</td>
                <td>Chat</td>
                <td>
                  <span className="badge bg-secondary">
                    Ongoing
                  </span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-primary me-2">
                    Continue
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    Notes
                  </button>
                </td>
              </tr>
            </tbody>

          </table>

        </div>
      </div>

    </div>
  )
}
