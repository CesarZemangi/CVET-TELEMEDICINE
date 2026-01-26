export default function VetResponses() {
  return (
    <div className="container-fluid">
      <h4 className="fw-semibold mb-3">Vet Responses</h4>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Case</th>
                <th>Veterinarian</th>
                <th>Response</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Loss of appetite</td>
                <td>Dr. Kumar</td>
                <td>Start electrolyte support</td>
                <td>18 Jan 2026</td>
              </tr>

              <tr>
                <td>Limping leg</td>
                <td>Dr. Meera</td>
                <td>Apply antiseptic and rest</td>
                <td>17 Jan 2026</td>
              </tr>

              <tr>
                <td>Fever symptoms</td>
                <td>Dr. Anand</td>
                <td>Administer antipyretic injection</td>
                <td>16 Jan 2026</td>
              </tr>

              <tr>
                <td>Skin infection</td>
                <td>Dr. Radha</td>
                <td>Topical ointment twice daily</td>
                <td>15 Jan 2026</td>
              </tr>

              <tr>
                <td>Eye irritation</td>
                <td>Dr. Kumar</td>
                <td>Saline wash and antibiotic drops</td>
                <td>14 Jan 2026</td>
              </tr>

              <tr>
                <td>Respiratory issue</td>
                <td>Dr. Meena</td>
                <td>Start antibiotics and monitor breathing</td>
                <td>13 Jan 2026</td>
              </tr>

              <tr>
                <td>Digestive problem</td>
                <td>Dr. Anjali</td>
                <td>Provide probiotics and adjust diet</td>
                <td>12 Jan 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
