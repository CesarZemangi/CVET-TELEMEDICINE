export default function Cases() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Health Cases</h4>
        <small className="text-muted">
          Review animal health issues reported for veterinary care
        </small>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">

          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Case</th>
                <th>Animal</th>
                <th>Status</th>
                <th>Veterinarian</th>
                <th>Date Reported</th>
                <th className="text-end pe-4">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="ps-4 fw-medium">Loss of appetite</td>
                <td>Cow</td>
                <td><span className="badge bg-warning text-dark">Pending Review</span></td>
                <td>Not Assigned</td>
                <td>18 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Limping leg</td>
                <td>Goat</td>
                <td><span className="badge bg-success">Resolved</span></td>
                <td>Dr. Kumar</td>
                <td>17 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Fever symptoms</td>
                <td>Buffalo</td>
                <td><span className="badge bg-danger">Critical</span></td>
                <td>Dr. Meena</td>
                <td>16 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Skin infection</td>
                <td>Dog</td>
                <td><span className="badge bg-warning text-dark">Under Treatment</span></td>
                <td>Dr. Arun</td>
                <td>15 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Eye irritation</td>
                <td>Sheep</td>
                <td><span className="badge bg-success">Resolved</span></td>
                <td>Dr. Radha</td>
                <td>14 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Respiratory issue</td>
                <td>Cow</td>
                <td><span className="badge bg-warning text-dark">Pending Review</span></td>
                <td>Not Assigned</td>
                <td>13 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Broken horn</td>
                <td>Goat</td>
                <td><span className="badge bg-success">Resolved</span></td>
                <td>Dr. Kumar</td>
                <td>12 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Digestive problem</td>
                <td>Horse</td>
                <td><span className="badge bg-warning text-dark">Under Treatment</span></td>
                <td>Dr. Anjali</td>
                <td>11 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Wing injury</td>
                <td>Hen</td>
                <td><span className="badge bg-danger">Critical</span></td>
                <td>Dr. Meena</td>
                <td>10 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Joint pain</td>
                <td>Buffalo</td>
                <td><span className="badge bg-success">Resolved</span></td>
                <td>Dr. Arun</td>
                <td>09 Jan 2026</td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Case</button></td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

    </div>
  )
}
