export default function Animals() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Livestock</h4>
        <small className="text-muted">
          Manage and view all animals registered on your farm
        </small>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">

          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Animal Name</th>
                <th>Species</th>
                <th>Age</th>
                <th>Health Status</th>
                <th className="text-end pe-4">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="ps-4 fw-medium">Lakshmi</td>
                <td>Cow</td>
                <td>4 Years</td>
                <td><span className="badge bg-success">Healthy</span></td>
                <td className="text-end pe-4">
                  <button className="btn btn-sm btn-outline-primary">View Details</button>
                </td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Kannan</td>
                <td>Goat</td>
                <td>2 Years</td>
                <td><span className="badge bg-warning text-dark">Under Treatment</span></td>
                <td className="text-end pe-4">
                  <button className="btn btn-sm btn-outline-primary">View Details</button>
                </td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Raja</td>
                <td>Buffalo</td>
                <td>6 Years</td>
                <td><span className="badge bg-success">Stable</span></td>
                <td className="text-end pe-4">
                  <button className="btn btn-sm btn-outline-primary">View Details</button>
                </td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Meena</td>
                <td>Hen</td>
                <td>1 Year</td>
                <td><span className="badge bg-danger">Critical</span></td>
                <td className="text-end pe-4">
                  <button className="btn btn-sm btn-outline-primary">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

    </div>
  )
}
