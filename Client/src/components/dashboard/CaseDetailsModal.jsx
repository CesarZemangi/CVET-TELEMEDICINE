import React from 'react';

const CaseDetailsModal = ({ isOpen, onClose, caseData }) => {
  if (!isOpen || !caseData) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 p-4">
            <h5 className="modal-title fw-bold">Case Details: {caseData.description}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 pt-0">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3">
                  <h6 className="fw-bold text-muted small mb-2">ANIMAL INFORMATION</h6>
                  <p className="mb-1"><strong>Type:</strong> {caseData.animal_type || 'N/A'}</p>
                  <p className="mb-0"><strong>Status:</strong> <span className={`badge ${caseData.status === 'open' ? 'bg-danger' : 'bg-success'}`}>{caseData.status}</span></p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3">
                  <h6 className="fw-bold text-muted small mb-2">REPORTING DETAILS</h6>
                  <p className="mb-1"><strong>Date:</strong> {new Date(caseData.created_at).toLocaleDateString()}</p>
                  <p className="mb-0"><strong>ID:</strong> #{caseData.id}</p>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 border rounded-3">
                  <h6 className="fw-bold text-muted small mb-2">DESCRIPTION & SYMPTOMS</h6>
                  <p className="mb-0">{caseData.description || 'No description provided.'}</p>
                </div>
              </div>
              {caseData.notes && (
                <div className="col-12">
                  <div className="p-3 border rounded-3 bg-light">
                    <h6 className="fw-bold text-muted small mb-2">ADDITIONAL NOTES</h6>
                    <p className="mb-0">{caseData.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer border-0 p-4 pt-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            {caseData.status === 'open' && (
               <button className="btn btn-primary px-4">Respond to Case</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailsModal;
