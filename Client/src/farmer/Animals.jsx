import React, { useState, useEffect } from "react";
import api from "../services/api";
import MetricCard from "../components/dashboard/MetricCard";

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", species: "", breed: "", age: "" });

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/farmer/animals");
      // The API returns { success: true, data: [...] } based on common project pattern
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
      setShowModal(false);
      setFormData({ name: "", species: "", breed: "", age: "" });
      fetchAnimals(); // Refresh list immediately
    } catch (err) {
      alert("Failed to add animal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Livestock Inventory</h4>
          <p className="text-muted small">Manage and monitor your farm animals</p>
        </div>
        <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i> Register Animal
        </button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : animals.length > 0 ? (
          animals.map((animal) => (
            <div key={animal.id} className="col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                      <i className="bi bi-tag-fill text-primary"></i>
                    </div>
                    <h6 className="fw-bold mb-0">{animal.name}</h6>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted small">Species</span>
                      <span className="small fw-bold">{animal.species}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Breed</span>
                      <span className="small fw-bold">{animal.breed}</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className={`status-badge ${animal.status === 'Healthy' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                      {animal.status || 'Active'}
                    </span>
                    <button className="btn btn-sm btn-outline-primary border-0">
                      Details <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="bg-white p-5 rounded-4 shadow-sm">
               <i className="bi bi-patch-question fs-1 text-muted opacity-25"></i>
               <p className="mt-3 text-muted">No animals found in your livestock record.</p>
               <button className="btn btn-primary-custom mt-2" onClick={() => setShowModal(true)}>Add Your First Animal</button>
            </div>
          </div>
        )}
      </div>

      {/* Basic Add Animal Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <form onSubmit={handleAddAnimal}>
                <div className="modal-header border-0 p-4">
                  <h5 className="modal-title fw-bold">Register New Animal</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4 pt-0">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Name</label>
                    <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-bold">Species</label>
                      <input type="text" className="form-control" placeholder="e.g. Cow" required value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-bold">Breed</label>
                      <input type="text" className="form-control" required value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-bold">Age (Years)</label>
                      <input type="number" className="form-control" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary-custom">Save Animal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
