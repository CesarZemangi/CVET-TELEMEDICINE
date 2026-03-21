import React, { useState, useEffect } from "react";
import api from "../services/api";
import MetricCard from "../components/dashboard/MetricCard";
import FormModalWrapper from "../components/common/FormModalWrapper";

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [livestockCount, setLivestockCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ tag_number: "", species: "", breed: "", age: "", health_status: "healthy" });
  const [editingAnimal, setEditingAnimal] = useState(null);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/farmer/animals");
      const result = res.data?.data;
      const animalsList = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []);
      setAnimals(animalsList);
      setLivestockCount(result?.totalItems || animalsList.length);
    } catch (err) {
      console.error("Error fetching animals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAnimal(null);
    setFormData({ tag_number: "", species: "", breed: "", age: "", health_status: "healthy" });
    setShowModal(true);
  };

  const handleOpenEditModal = (animal) => {
    setEditingAnimal(animal);
    setFormData({
      tag_number: animal.tag_number || "",
      species: animal.species || "",
      breed: animal.breed || "",
      age: animal.age || "",
      health_status: animal.health_status || "healthy"
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnimal) {
        await api.put(`/farmer/animals/${editingAnimal.id}`, formData);
      } else {
        await api.post("/farmer/animals", formData);
      }
      setShowModal(false);
      setFormData({ tag_number: "", species: "", breed: "", age: "", health_status: "healthy" });
      fetchAnimals();
    } catch (err) {
      alert(`Failed to ${editingAnimal ? 'update' : 'add'} animal: ` + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteAnimal = async (id) => {
    if (window.confirm("Are you sure you want to delete this animal?")) {
      try {
        await api.delete(`/farmer/animals/${id}`);
        fetchAnimals();
      } catch (err) {
        alert("Failed to delete animal: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Livestock Inventory ({livestockCount})</h4>
          <p className="text-muted small">Manage and monitor your farm animals</p>
        </div>
        <button className="btn btn-primary-custom" onClick={handleOpenAddModal}>
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
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                        <i className="bi bi-tag-fill text-primary"></i>
                      </div>
                      <h6 className="fw-bold mb-0">{animal.tag_number}</h6>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-danger border-0" 
                      onClick={() => handleDeleteAnimal(animal.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
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
                    <span className={`status-badge ${animal.health_status === 'healthy' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                      {animal.health_status || 'Active'}
                    </span>
                    <button 
                      className="btn btn-sm btn-outline-primary border-0"
                      onClick={() => handleOpenEditModal(animal)}
                    >
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
               <button className="btn btn-primary-custom mt-2" onClick={handleOpenAddModal}>Add Your First Animal</button>
            </div>
          </div>
        )}
      </div>

      {/* Basic Add/Edit Animal Modal */}
      <FormModalWrapper
        show={showModal}
        title={editingAnimal ? "Edit Animal" : "Register New Animal"}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        submitLabel={editingAnimal ? "Update Animal" : "Save Animal"}
      >
        <div className="mb-3">
          <label className="form-label small fw-bold">Tag Number</label>
          <input type="text" className="form-control" placeholder="e.g. TAG-001" required value={formData.tag_number} onChange={e => setFormData({...formData, tag_number: e.target.value})} />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold">Species</label>
            <input type="text" className="form-control" placeholder="e.g. Cow" required value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold">Breed</label>
            <input type="text" className="form-control" placeholder="e.g. Holstein" required value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold">Age (Years)</label>
            <input type="number" className="form-control" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold">Health Status</label>
            <select className="form-select" value={formData.health_status} onChange={e => setFormData({...formData, health_status: e.target.value})}>
              <option value="healthy">Healthy</option>
              <option value="sick">Sick</option>
              <option value="under treatment">Under Treatment</option>
            </select>
          </div>
        </div>
      </FormModalWrapper>
    </div>
  );
}
