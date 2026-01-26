export default function Consultations() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Consultations</h4>
        <small className="text-muted">
          View and manage veterinary consultations
        </small>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Veterinarian</th>
                <th>Animal</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Scheduled Time</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Dr. Kumar</td>
                <td>Cow</td>
                <td><span className="badge bg-primary">Video</span></td>
                <td><span className="badge bg-success">Scheduled</span></td>
                <td>16 Jan 2026, 10:30 AM</td>
                <td className="text-end"><button className="btn btn-sm btn-primary">Join</button></td>
              </tr>

              <tr>
                <td>Dr. Meera</td>
                <td>Goat</td>
                <td><span className="badge bg-info text-dark">Chat</span></td>
                <td><span className="badge bg-warning text-dark">Waiting</span></td>
                <td>15 Jan 2026, 4:00 PM</td>
                <td className="text-end"><button className="btn btn-sm btn-outline-primary">Open Chat</button></td>
              </tr>

              <tr>
                <td>Dr. Anand</td>
                <td>Sheep</td>
                <td><span className="badge bg-secondary">Chat</span></td>
                <td><span className="badge bg-secondary">Completed</span></td>
                <td>12 Jan 2026, 11:15 AM</td>
                <td className="text-end"><button className="btn btn-sm btn-outline-secondary">View Notes</button></td>
              </tr>

              <tr>
                <td>Dr. Radha</td>
                <td>Buffalo</td>
                <td><span className="badge bg-primary">Video</span></td>
                <td><span className="badge bg-danger">Cancelled</span></td>
                <td>11 Jan 2026, 2:00 PM</td>
                <td className="text-end"><button className="btn btn-sm btn-outline-danger">Reschedule</button></td>
              </tr>

              <tr>
                <td>Dr. Arun</td>
                <td>Dog</td>
                <td><span className="badge bg-info text-dark">Chat</span></td>
                <td><span className="badge bg-success">Scheduled</span></td>
                <td>10 Jan 2026, 9:45 AM</td>
                <td className="text-end"><button className="btn btn-sm btn-primary">Join</button></td>
              </tr>

              <tr>
                <td>Dr. Anjali</td>
                <td>Horse</td>
                <td><span className="badge bg-primary">Video</span></td>
                <td><span className="badge bg-warning text-dark">Waiting</span></td>
                <td>09 Jan 2026, 3:30 PM</td>
                <td className="text-end"><button className="btn btn-sm btn-outline-primary">Open Chat</button></td>
              </tr>

              <tr>
                <td>Dr. Meena</td>
                <td>Hen</td>
                <td><span className="badge bg-info text-dark">Chat</span></td>
                <td><span className="badge bg-success">Scheduled</span></td>
                <td>08 Jan 2026, 5:00 PM</td>
                <td className="text-end"><button className="btn btn-sm btn-primary">Join</button></td>
              </tr>

              <tr>
                <td>Dr. Kumar</td>
                <td>Sheep</td>
                <td><span className="badge bg-primary">Video</span></td>
                <td><span className="badge bg-secondary">Completed</span></td>
                <td>07 Jan 2026, 1:15 PM</td>
                <td className="text-end"><button className="btn btn-sm btn-outline-secondary">View Notes</button></td>
              </tr>

              <tr>
                <td>Dr. Radha</td>
                <td>Cow</td>
                <td><span className="badge bg-info text-dark">Chat</span></td>
                <td><span className="badge bg-danger">Cancelled</span></td>
                <td>06 Jan 2026, 11:00 AM</td>
                <td className="text-end"><button className="btn btn-sm btn-outline-danger">Reschedule</button></td>
              </tr>

              <tr>
                <td>Dr. Anand</td>
                <td>Goat</td>
                <td><span className="badge bg-primary">Video</span></td>
                <td><span className="badge bg-success">Scheduled</span></td>
                <td>05 Jan 2026, 4:45 PM</td>
                <td className="text-end"><button className="btn btn-sm btn-primary">Join</button></td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

    </div>
  )
}
