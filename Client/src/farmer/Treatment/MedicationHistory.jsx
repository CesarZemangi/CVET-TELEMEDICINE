import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { getLabResults, getLabRequests } from "../services/farmer.diagnostics.service";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function MedicationHistory() {
  const [medications, setMedications] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [labResults, setLabResults] = useState([]);
  const [labRequests, setLabRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/farmer/treatment/medications");
      const data = res.data.data || res.data;
      setMedications(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching medication history:", err);
      setError("Failed to load medication history.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await api.get("/farmer/cases");
      const data = res.data?.data;
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setCases(list);
    } catch (err) {
      console.error("Error fetching cases for filter:", err);
      setCases([]);
    }
  };

  useEffect(() => {
    fetchMedications();
    fetchCases();
    // load diagnostics data once
    (async () => {
      try {
        const [resultsRes, requestsRes] = await Promise.all([getLabResults(), getLabRequests()]);
        const resultsList = Array.isArray(resultsRes?.data) ? resultsRes.data : Array.isArray(resultsRes) ? resultsRes : [];
        const requestsList = Array.isArray(requestsRes?.data) ? requestsRes.data : Array.isArray(requestsRes) ? requestsRes : [];
        setLabResults(resultsList);
        setLabRequests(requestsList);
      } catch (err) {
        console.error("Error fetching diagnostics data:", err);
        setLabResults([]);
        setLabRequests([]);
      }
    })();
  }, []);

  const isLabResultEntry = (item) => String(item?.medication_name || "").startsWith("Lab Result:");

  const filteredMeds = medications.filter((med) =>
    selectedCaseId ? String(med.case_id) === String(selectedCaseId) : true
  );

  const filteredResults = labResults.filter((res) =>
    selectedCaseId ? String(res.LabRequest?.case_id || res.case_id) === String(selectedCaseId) : true
  );

  const filteredRequests = labRequests.filter((req) =>
    selectedCaseId ? String(req.case_id) === String(selectedCaseId) : true
  );

  return (
    <DashboardSection title="Medication History">
      <p className="text-muted mb-4">
        A complete record of medications and lab result records linked to your animals.
      </p>

      <div className="mb-3">
        <label className="form-label small fw-bold">Filter by Case</label>
        <select
          className="form-select"
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
        >
          <option value="">All cases</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id} {c.title || "Case"} {c.Animal?.tag_number ? `- ${c.Animal.tag_number}` : ""}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="p-3 border-bottom bg-light fw-bold">Medications</div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Start Date</th>
                    <th>Animal</th>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>End Date</th>
                    <th>Administered By</th>
                    <th className="pe-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMeds.length > 0 ? (
                    filteredMeds.map((med) => (
                      <tr key={med.id}>
                        <td className="ps-4">
                          {new Date(med.start_date).toLocaleDateString()}
                        </td>
                        <td>
                          <span className="fw-medium">{med.Animal?.tag_number}</span>
                          <br />
                          <small className="text-muted">{med.Animal?.species}</small>
                        </td>
                        <td className="fw-bold text-brown">
                          {med.medication_name}
                          {isLabResultEntry(med) && (
                            <span className="badge bg-info-subtle text-info-emphasis border ms-2">Lab Result</span>
                          )}
                        </td>
                        <td>{med.dosage}</td>
                        <td>
                          {med.end_date ? new Date(med.end_date).toLocaleDateString() : "-"}
                        </td>
                        <td>Dr. {med.Case?.vet?.User?.name || "Unknown"}</td>
                        <td className="pe-4">
                          <small className="text-wrap" style={{ maxWidth: '200px', display: 'block' }}>
                            {med.notes || "-"}
                          </small>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        No medication records found for your animals.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-bottom bg-light fw-bold">Lab Requests</div>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Case</th>
                    <th>Test Type</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length > 0 ? filteredRequests.map((r) => (
                    <tr key={`req-${r.id}`}>
                      <td className="ps-4">#{r.case_id}</td>
                      <td>{r.test_type}</td>
                      <td><span className={`badge ${r.status === "completed" ? "bg-success" : "bg-warning text-dark"}`}>{r.status}</span></td>
                      <td className="small text-muted">{r.notes || "-"}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center text-muted py-3">No lab requests.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-bottom bg-light fw-bold">Lab Results</div>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Case</th>
                    <th>Result</th>
                    <th>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.length > 0 ? filteredResults.map((res) => (
                    <tr key={`res-${res.id}`}>
                      <td className="ps-4">#{res.LabRequest?.case_id || res.case_id}</td>
                      <td>{res.result}</td>
                      <td className="small text-muted">{new Date(res.uploaded_at).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="text-center text-muted py-3">No lab results.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  );
}
