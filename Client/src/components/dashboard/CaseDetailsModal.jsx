import React from 'react';

const CaseDetailsModal = ({ isOpen, onClose, caseData, onRespond }) => {
  if (!isOpen || !caseData) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, overflowY: 'auto' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 p-4">
            <h5 className="modal-title fw-bold">Case Details: {caseData.title || caseData.description}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 pt-0">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3 h-100">
                  <h6 className="fw-bold text-muted small mb-2">ANIMAL INFORMATION</h6>
                  <p className="mb-1"><strong>Tag Number:</strong> {caseData.Animal?.tag_number || caseData.animal_id || 'N/A'}</p>
                  <p className="mb-1"><strong>Species:</strong> {caseData.Animal?.species || caseData.animal_type || 'N/A'}</p>
                  <p className="mb-0"><strong>Status:</strong> <span className={`badge ${caseData.status === 'open' ? 'bg-danger' : 'bg-success'}`}>{caseData.status}</span></p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3 h-100">
                  <h6 className="fw-bold text-muted small mb-2">REPORTING DETAILS</h6>
                  <p className="mb-1"><strong>Date:</strong> {new Date(caseData.created_at).toLocaleDateString()}</p>
                  <p className="mb-1"><strong>ID:</strong> #{caseData.id}</p>
                  <p className="mb-0"><strong>Assigned Vet:</strong> {caseData.vet?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 border rounded-3">
                  <h6 className="fw-bold text-muted small mb-2">DESCRIPTION & SYMPTOMS</h6>
                  <p className="mb-0">{caseData.description || 'No description provided.'}</p>
                  {caseData.symptoms && (
                    <div className="mt-2 pt-2 border-top">
                      <strong>Symptoms:</strong> {caseData.symptoms}
                    </div>
                  )}
                </div>
              </div>
              {caseData.latest_prediction && (
                <div className="col-12">
                  <div className="p-3 border rounded-3 bg-light">
                    <h6 className="fw-bold text-muted small mb-2">LATEST VET AI PREDICTION</h6>
                    <p className="mb-1">
                      <strong>Predicted Disease:</strong> {caseData.latest_prediction.predicted_disease || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Confidence:</strong>{" "}
                      {caseData.latest_prediction.confidence != null
                        ? `${(Number(caseData.latest_prediction.confidence) * 100).toFixed(1)}%`
                        : "N/A"}
                    </p>
                    <p className="mb-0">
                      <strong>Predicted At:</strong> {new Date(caseData.latest_prediction.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
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
               <button 
                 className="btn btn-primary px-4"
                 onClick={() => onRespond && onRespond(caseData)}
               >
                 Respond to Case
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailsModal;
