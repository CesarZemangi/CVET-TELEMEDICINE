export default function VetCases() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Incoming Cases</h4>
        <small className="text-muted">
          Review animal health issues reported by farmers
        </small>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Animal</th>
                <th>Symptoms</th>
                <th>Farmer</th>
                <th>Priority</th>
                <th>Date</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <i className="bi bi-heart-pulse-fill text-success me-2"></i>
                  Cow
                </td>
                <td>Loss of appetite, fever</td>
                <td>Ramesh</td>
                <td>
                  <span className="badge bg-danger">
                    High
                  </span>
                </td>
                <td>16 Jan 2026</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-primary me-2">
                    Accept
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    View
                  </button>
                </td>
              </tr>

              <tr>
                <td>
                  <i className="bi bi-heart-pulse-fill text-success me-2"></i>
                  Goat
                </td>
                <td>Limping, swelling</td>
                <td>Suresh</td>
                <td>
                  <span className="badge bg-warning text-dark">
                    Medium
                  </span>
                </td>
                <td>15 Jan 2026</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-primary me-2">
                    Accept
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    View
                  </button>
                </td>
              </tr>

              <tr>
                <td>
                  <i className="bi bi-heart-pulse-fill text-success me-2"></i>
                  Sheep
                </td>
                <td>Skin irritation</td>
                <td>Anita</td>
                <td>
                  <span className="badge bg-secondary">
                    Low
                  </span>
                </td>
                <td>14 Jan 2026</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-primary me-2">
                    Accept
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    View
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
