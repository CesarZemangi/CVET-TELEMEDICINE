export default function ActiveAnimals() {
  return (
    <div className="container-fluid">
      <h4 className="fw-semibold mb-3">Active Animals</h4>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Animal</th>
                <th>Species</th>
                <th>Age</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lakshmi</td>
                <td>Cow</td>
                <td>4 Years</td>
                <td><span className="badge bg-success">Stable</span></td>
              </tr>

              <tr>
                <td>Kannan</td>
                <td>Goat</td>
                <td>2 Years</td>
                <td><span className="badge bg-warning text-dark">Under Treatment</span></td>
              </tr>

              <tr>
                <td>Raja</td>
                <td>Buffalo</td>
                <td>6 Years</td>
                <td><span className="badge bg-success">Healthy</span></td>
              </tr>

              <tr>
                <td>Meena</td>
                <td>Hen</td>
                <td>1 Year</td>
                <td><span className="badge bg-danger">Critical</span></td>
              </tr>

              <tr>
                <td>Arun</td>
                <td>Dog</td>
                <td>3 Years</td>
                <td><span className="badge bg-success">Stable</span></td>
              </tr>

              <tr>
                <td>Sita</td>
                <td>Goat</td>
                <td>5 Years</td>
                <td><span className="badge bg-warning text-dark">Under Observation</span></td>
              </tr>

              <tr>
                <td>Muthu</td>
                <td>Cow</td>
                <td>7 Years</td>
                <td><span className="badge bg-success">Healthy</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
