export default function MyAnimals() {
  return (
    <div className="container-fluid px-4 py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">My Animals</h4>
          <small className="text-muted">
            Track livestock health and medical history
          </small>
        </div>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addAnimalModal"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Animal
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">

          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Animal</th>
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
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Kannan</td>
                <td>Goat</td>
                <td>2 Years</td>
                <td><span className="badge bg-warning text-dark">Under Treatment</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Raja</td>
                <td>Buffalo</td>
                <td>6 Years</td>
                <td><span className="badge bg-success">Healthy</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Meena</td>
                <td>Hen</td>
                <td>1 Year</td>
                <td><span className="badge bg-danger">Critical</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Arun</td>
                <td>Dog</td>
                <td>3 Years</td>
                <td><span className="badge bg-success">Healthy</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Sita</td>
                <td>Goat</td>
                <td>5 Years</td>
                <td><span className="badge bg-warning text-dark">Under Treatment</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Muthu</td>
                <td>Cow</td>
                <td>7 Years</td>
                <td><span className="badge bg-success">Healthy</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Radha</td>
                <td>Sheep</td>
                <td>2 Years</td>
                <td><span className="badge bg-warning text-dark">Under Treatment</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Kumar</td>
                <td>Horse</td>
                <td>8 Years</td>
                <td><span className="badge bg-success">Healthy</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Anjali</td>
                <td>Cow</td>
                <td>3 Years</td>
                <td><span className="badge bg-danger">Critical</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              {/* Additional entries */}
              <tr>
                <td className="ps-4 fw-medium">Balu</td>
                <td>Ox</td>
                <td>9 Years</td>
                <td><span className="badge bg-success">Stable</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Priya</td>
                <td>Duck</td>
                <td>1 Year</td>
                <td><span className="badge bg-warning text-dark">Under Observation</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Ganesh</td>
                <td>Cow</td>
                <td>10 Years</td>
                <td><span className="badge bg-success">Healthy</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Latha</td>
                <td>Goat</td>
                <td>4 Years</td>
                <td><span className="badge bg-danger">Critical</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Ramesh</td>
                <td>Buffalo</td>
                <td>5 Years</td>
                <td><span className="badge bg-success">Stable</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Divya</td>
                <td>Hen</td>
                <td>2 Years</td>
                <td><span className="badge bg-warning text-dark">Under Treatment</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>

              <tr>
                <td className="ps-4 fw-medium">Surya</td>
                <td>Dog</td>
                <td>6 Years</td>
                <td><span className="badge bg-success">Healthy</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-outline-primary">View Health</button></td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

      {/* Add Animal Modal */}
      <div
        className="modal fade"
        id="addAnimalModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title fw-semibold">Add Animal</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

                        <div className="modal-body">
                          <div className="mb-3">
                            <label className="form-label">Animal Name</label>
                            <input type="text" className="form-control" placeholder="Enter animal name" />
                          </div>
            
                          <div className="mb-3">
                            <label className="form-label">Species</label>
                            <select className="form-select">
                              <option>Select species</option>
                              <option>Cow</option>
                              <option>Goat</option>
                              <option>Buffalo</option>
                              <option>Sheep</option>
                            </select>
                          </div>
            
                          <div className="mb-3">
                            <label className="form-label">Age</label>
                            <input type="text" className="form-control" placeholder="Enter age" />
                          </div>
                        </div>
            
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" className="btn btn-primary">Add Animal</button>
                        </div>
            
                      </div>
                    </div>
                  </div>
            
                </div>
              );
            }
