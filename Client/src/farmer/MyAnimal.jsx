import React, { useState, useEffect } from "react";
import api from "../services/api";
import * as bootstrap from "bootstrap";

export default function MyAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ tag_number: "", species: "", breed: "", age: "", health_status: "healthy" });

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/farmer/animals");
      setAnimals(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Error fetching animals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    try {
      await api.post("/farmer/animals", formData);
      setFormData({ tag_number: "", species: "", breed: "", age: "", health_status: "healthy" });
      // Close modal using bootstrap
      const modal = document.getElementById('addAnimalModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      fetchAnimals();
    } catch (err) {
      alert("Failed to add animal: " + (err.response?.data?.message || err.message));
    }
  };

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
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Tag Number</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Health Status</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {animals.length > 0 ? animals.map(animal => (
                  <tr key={animal.id}>
                    <td className="ps-4 fw-medium">{animal.tag_number}</td>
                    <td>{animal.species}</td>
                    <td>{animal.breed}</td>
                    <td>{animal.age} Years</td>
                    <td>
                      <span className={`badge ${animal.health_status === 'healthy' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {animal.health_status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-primary">View Health</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No animals found</td></tr>
                )}
              </tbody>
            </table>
          )}
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

            <form onSubmit={handleAddAnimal}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tag Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter tag number" 
                    required 
                    value={formData.tag_number} 
                    onChange={e => setFormData({...formData, tag_number: e.target.value})} 
                  />
                </div>
  
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Species</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Cow" 
                      required 
                      value={formData.species} 
                      onChange={e => setFormData({...formData, species: e.target.value})} 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Breed</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Holstein" 
                      required 
                      value={formData.breed} 
                      onChange={e => setFormData({...formData, breed: e.target.value})} 
                    />
                  </div>
                </div>
  
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Age</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Enter age" 
                      required 
                      value={formData.age} 
                      onChange={e => setFormData({...formData, age: e.target.value})} 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Health Status</label>
                    <select 
                      className="form-select" 
                      value={formData.health_status} 
                      onChange={e => setFormData({...formData, health_status: e.target.value})}
                    >
                      <option value="healthy">Healthy</option>
                      <option value="sick">Sick</option>
                      <option value="under treatment">Under Treatment</option>
                    </select>
                  </div>
                </div>
              </div>
  
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Add Animal</button>
              </div>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
}
