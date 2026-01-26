import { useEffect, useState } from "react"
import { getAnimals } from "../services/farmer.animals.service"

export default function Animals() {
const [animals, setAnimals] = useState([])

useEffect(() => {
getAnimals().then(res => setAnimals(res.data))
}, [])

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
          {animals.map(animal => (
            <tr key={animal.id}>
              <td className="ps-4 fw-medium">{animal.name}</td>
              <td>{animal.species}</td>
              <td>{animal.age} Years</td>
              <td>
                <span className={`badge bg-${animal.statusColor}`}>
                  {animal.healthStatus}
                </span>
              </td>
              <td className="text-end pe-4">
                <button className="btn btn-sm btn-outline-primary">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  </div>

</div>)} 