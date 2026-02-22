import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCases, addCase } from "./services/farmer.cases.service";
import api from "../services/api";
import CaseDetailsModal from "../components/dashboard/CaseDetailsModal";

export default function Cases() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    animal_id: "",
    vet_id: "",
    title: "",
    description: "",
    symptoms: "",
    priority: "medium"
  });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await getCases();
      const casesArray = data?.data || data?.rows || (Array.isArray(data) ? data : []);
      setCases(casesArray);
    } catch (err) {
      console.error("Error fetching farmer cases:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const res = await api.get("/farmer/animals");
      setAnimals(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Error fetching animals:", err);
    }
  };

  const fetchVets = async () => {
    try {
      const res = await api.get("/user/vets");
      setVets(res.data);
    } catch (err) {
      console.error("Error fetching vets:", err);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchAnimals();
    fetchVets();
  }, []);

  const handleViewCase = (caseData) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };

  const handleMessageVet = (c) => {
    if (!c.vet_id || !c.vet) {
      alert("No vet assigned to this case.");
      return;
    }
    navigate("/farmerdashboard/communication/messages", { 
      state: { 
        initialPartner: {
          id: c.vet.user_id,
          name: c.vet.name,
          role: 'vet'
        },
        initialCaseId: c.id 
      } 
    });
  };

  const handleAddCase = async (e) => {
    e.preventDefault();
    try {
      await addCase(formData);
      setShowAddModal(false);
      setFormData({
        animal_id: "",
        vet_id: "",
        title: "",
        description: "",
        symptoms: "",
        priority: "medium"
      });
      setTimeout(() => {
        fetchCases();
      }, 500);
      alert("Case reported successfully!");
    } catch (err) {
      alert("Failed to report case: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container-fluid px-4 py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Health Cases</h4>
          <small className="text-muted">
            Report animal health issues and select a veterinarian for care
          </small>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Report New Case
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Title</th>
                    <th>Animal</th>
                    <th>Assigned Vet</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {cases.length > 0 ? cases.map(c => (
                    <tr key={c.id}>
                      <td className="ps-4 fw-medium">{c.title}</td>
                      <td>{c.Animal?.tag_number || c.animal_id}</td>
                      <td>{c.vet?.name || "N/A"}</td>
                      <td>
                        <span className={`badge ${
                          c.priority === 'critical' ? 'bg-danger' : 
                          c.priority === 'high' ? 'bg-warning text-dark' : 
                          c.priority === 'medium' ? 'bg-info text-dark' : 'bg-secondary'
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${c.status === 'open' ? 'bg-warning text-dark' : 'bg-success'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        {c.vet_id && (
                          <button 
                            className="btn btn-sm btn-outline-brown me-2"
                            onClick={() => handleMessageVet(c)}
                          >
                            <i className="bi bi-chat-dots me-1"></i>
                            Message Vet
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewCase(c)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="text-center py-4 text-muted">No cases found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      <CaseDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        caseData={selectedCase} 
      />

      {/* Report Case Modal */}
      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <form onSubmit={handleAddCase}>
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="modal-title fw-bold">Report New Health Case</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Animal</label>
                    <select 
                      className="form-select" 
                      required 
                      value={formData.animal_id} 
                      onChange={e => setFormData({...formData, animal_id: e.target.value})}
                    >
                      <option value="">Choose an animal...</option>
                      {animals.map(animal => (
                        <option key={animal.id} value={animal.id}>
                          {animal.tag_number} ({animal.species})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Veterinarian</label>
                    <select 
                      className="form-select" 
                      required 
                      value={formData.vet_id} 
                      onChange={e => setFormData({...formData, vet_id: e.target.value})}
                    >
                      <option value="">Choose a vet...</option>
                      {vets.map(vet => (
                        <option key={vet.id} value={vet.id}>
                          Dr. {vet.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Case Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Short summary of the issue" 
                      required 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Detailed Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Provide more details about the problem" 
                      required 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Priority Level</label>
                    <select 
                      className="form-select" 
                      value={formData.priority} 
                      onChange={e => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Submit Case</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
