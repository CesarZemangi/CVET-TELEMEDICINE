import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCases, getUnassignedCases, assignCase } from "./services/vet.cases.service"
import { createConsultation } from "./services/vet.consultations.service"
import CaseDetailsModal from "../components/dashboard/CaseDetailsModal";

export default function VetCases() {
  const navigate = useNavigate();
  const [myCases, setMyCases] = useState([])
  const [unassignedCases, setUnassignedCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-cases");

  const fetchData = async () => {
    try {
      setLoading(true)
      const myData = await getCases()
      const unassignedData = await getUnassignedCases()
      setMyCases(myData?.data || myData || [])
      setUnassignedCases(unassignedData?.data || unassignedData || [])
    } catch (error) {
      console.error("Error fetching cases:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAssign = async (id) => {
    try {
      await assignCase(id)
      alert("Case accepted successfully")
      fetchData()
    } catch (error) {
      alert("Failed to assign case")
    }
  }

  const handleViewCase = (caseData) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };

  const handleMessageFarmer = (c) => {
    if (!c.farmer_id || !c.farmer) {
      alert("Farmer data not available.");
      return;
    }
    navigate("/vetdashboard/communication/messages", { 
      state: { 
        initialPartner: c.farmer, 
        initialCaseId: c.id 
      } 
    });
  };

  const handleStartConsultation = (caseId) => {
    setConsultCaseId(caseId);
    setShowConsultModal(true);
  };

  const submitConsultation = async (e) => {
    e.preventDefault();
    try {
      await createConsultation({
        case_id: consultCaseId,
        ...consultData
      });
      setShowConsultModal(false);
      setConsultData({ mode: "chat", notes: "" });
      alert("Consultation started successfully");
    } catch (error) {
      alert("Failed to start consultation: " + (error.response?.data?.error || error.message));
    }
  };

  const currentCases = activeTab === "my-cases" ? myCases : unassignedCases;

  return (
    <div className="container-fluid px-4 py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Cases Management</h4>
          <small className="text-muted">
            Review and manage animal health issues
          </small>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4 border-0">
        <li className="nav-item">
          <button 
            className={`nav-link border-0 fw-medium ${activeTab === 'my-cases' ? 'active text-primary border-bottom border-primary border-2' : 'text-muted'}`}
            onClick={() => setActiveTab('my-cases')}
          >
            My Assigned Cases
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link border-0 fw-medium ${activeTab === 'unassigned' ? 'active text-primary border-bottom border-primary border-2' : 'text-muted'}`}
            onClick={() => setActiveTab('unassigned')}
          >
            Unassigned Cases
          </button>
        </li>
      </ul>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Animal</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentCases.length > 0 ? currentCases.map(c => (
                  <tr key={c.id}>
                    <td><span className="fw-medium">{c.title}</span></td>
                    <td>
                      <i className="bi bi-tag-fill text-muted me-2"></i>
                      Animal ID: {c.animal_id}
                    </td>
                    <td>
                      <span className={`badge ${
                        c.priority === 'critical' ? 'bg-danger' : 
                        c.priority === 'high' ? 'bg-warning text-dark' : 'bg-info text-dark'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${c.status === 'open' ? 'bg-danger' : 'bg-success'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                      {activeTab === 'unassigned' && (
                        <button 
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleAssign(c.id)}
                        >
                          Accept Case
                        </button>
                      )}
                      {activeTab === 'my-cases' && c.status !== 'closed' && (
                        <>
                          <button 
                            className="btn btn-sm btn-outline-brown me-2"
                            onClick={() => handleMessageFarmer(c)}
                          >
                            <i className="bi bi-chat-dots me-1"></i>
                            Message Farmer
                          </button>
                          <button 
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleStartConsultation(c.id)}
                          >
                            Start Consultation
                          </button>
                        </>
                      )}
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleViewCase(c)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No cases found in this category</td></tr>
                )}
              </tbody>
            </table>
          )}

        </div>
      </div>

      <CaseDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        caseData={selectedCase} 
      />

      {/* Start Consultation Modal */}
      {showConsultModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <form onSubmit={submitConsultation}>
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="modal-title fw-bold">Start Consultation</h5>
                  <button type="button" className="btn-close" onClick={() => setShowConsultModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Consultation Mode</label>
                    <select 
                      className="form-select" 
                      value={consultData.mode} 
                      onChange={e => setConsultData({...consultData, mode: e.target.value})}
                    >
                      <option value="chat">Chat</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Initial Notes</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="Enter preliminary observations or notes"
                      value={consultData.notes}
                      onChange={e => setConsultData({...consultData, notes: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowConsultModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Consultation</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
