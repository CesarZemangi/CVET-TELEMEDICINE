export default function Appointments() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Appointments</h4>
        <small className="text-muted">
          Scheduled farmer consultations
        </small>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Farmer</th>
                <th>Animal</th>
                <th>Mode</th>
                <th>Time</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Ramesh</td>
                <td>Cow</td>
                <td>Video</td>
                <td>17 Jan 2026, 10:30 AM</td>
                <td>
                  <span className="badge bg-success">
                    Scheduled
                  </span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-primary">
                    Join
                  </button>
                </td>
              </tr>

              <tr>
                <td>Suresh</td>
                <td>Goat</td>
                <td>Chat</td>
                <td>17 Jan 2026, 02:00 PM</td>
                <td>
                  <span className="badge bg-warning text-dark">
                    Upcoming
                  </span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary">
                    Open
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
