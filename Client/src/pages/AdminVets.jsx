import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormModalWrapper from '../components/common/FormModalWrapper';
import '../styles/adminFarmers.css';

export default function AdminVets() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [ratingForm, setRatingForm] = useState({
    rating_value: 5,
    comment: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchVets();
  }, []);

  const stats = useMemo(() => {
    const totals = vets.reduce(
      (acc, v) => {
        acc.assigned += Number(v.assignedCases || 0);
        acc.consults += Number(v.totalConsultations || v.consultations || 0);
        return acc;
      },
      { assigned: 0, consults: 0 }
    );
    return { count: vets.length, ...totals };
  }, [vets]);

  const fetchVets = async () => {
    try {
      const res = await api.get('/admin/vets');
      setVets(res.data);
    } catch (err) {
      console.error("Error fetching vets:", err);
    } finally {
      setLoading(false);
    }
  };

  const openRateModal = (vet) => {
    setSelectedVet(vet);
    setRatingForm({ rating_value: 5, comment: '' });
    setShowRateModal(true);
  };

  const handleSubmitRating = async (event) => {
    event.preventDefault();
    if (!selectedVet) return;

    try {
      setSubmitting(true);
      await api.post(`/vets/${selectedVet.id}/reviews`, ratingForm);
      setShowRateModal(false);
      setSelectedVet(null);
      setRatingForm({ rating_value: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4 af-page">
      <div className="af-hero">
        <div>
          <p className="af-kicker">Clinical Network • Live</p>
          <h1 className="af-title">Veterinarians Directory</h1>
          <p className="af-subtitle">Manage expert veterinarians, licenses, and current workload.</p>
          <div className="af-pills">
            <span className="af-pill">Vets • {stats.count}</span>
            <span className="af-pill af-pill-emerald">Assigned • {stats.assigned}</span>
            <span className="af-pill af-pill-amber">Consults • {stats.consults}</span>
          </div>
        </div>
      </div>

      <div className="af-card">
        <div className="af-card-header">
          <h3>Roster</h3>
          <span className="af-meta">Updated just now</span>
        </div>
        <div className="af-table-wrapper">
          <table className="af-table">
            <thead>
              <tr>
                <th>Vet Name</th>
                <th>Specialization</th>
                <th>License #</th>
                <th>Exp (Years)</th>
                <th>Assigned</th>
                <th>Consults</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading veterinarians...</td></tr>
              ) : vets.length > 0 ? vets.map(v => (
                <tr key={v.id} className="af-row">
                  <td className="af-cell-strong">{v.name}</td>
                  <td>{v.specialization || 'General'}</td>
                  <td className="text-danger small">{v.license_number || 'N/A'}</td>
                  <td>{v.experience_years || 0} yrs</td>
                  <td>
                    <span className="af-badge">{v.assignedCases || 0}</span>
                  </td>
                  <td>
                    <span className="af-badge">{v.totalConsultations || 0}</span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button 
                        className="af-btn-ghost"
                        onClick={() => navigate('/admindashboard/vet-performance', { state: { vetId: v.id } })}
                      >
                        Performance
                      </button>
                      <button 
                        className="af-btn"
                        onClick={() => navigate('/admindashboard/communication/messages', { state: { initialPartner: { id: v.id, name: v.name, role: 'vet' } } })}
                      >
                        Contact
                      </button>
                      <button
                        className="af-btn-soft"
                        onClick={() => openRateModal(v)}
                      >
                        Rate
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No veterinarians found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FormModalWrapper
        show={showRateModal}
        title={`Rate ${selectedVet?.name || 'Veterinarian'}`}
        onClose={() => {
          setShowRateModal(false);
          setSelectedVet(null);
        }}
        onSubmit={handleSubmitRating}
        submitLabel={submitting ? 'Saving...' : 'Save Rating'}
      >
        <div className="mb-3">
          <label className="form-label fw-bold small">Rating</label>
          <div className="d-flex gap-3 flex-wrap">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="form-check-label d-flex align-items-center gap-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rating_value"
                  checked={Number(ratingForm.rating_value) === value}
                  onChange={() => setRatingForm((current) => ({ ...current, rating_value: value }))}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold small">Comment</label>
          <textarea
            className="form-control"
            rows="4"
            value={ratingForm.comment}
            onChange={(event) => setRatingForm((current) => ({ ...current, comment: event.target.value }))}
            placeholder="Write your comment about this veterinarian."
            required
          />
        </div>
      </FormModalWrapper>
    </div>
  );
}
