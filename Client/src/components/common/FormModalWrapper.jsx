import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export default function FormModalWrapper({
  title,
  show,
  onClose,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  children,
  contentClassName = "border-0 shadow-lg",
  bodyClassName = "p-4",
  footerClassName = "border-0 p-4 pt-0",
  submitDisabled = false
}) {
  // Lock body scroll while the modal is open to avoid background scrolling glitches.
  useEffect(() => {
    if (!show) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [show]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return ReactDOM.createPortal(
    <div
      className="modal d-block show"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        overflowY: "auto",
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered w-100"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-content ${contentClassName}`} style={{ maxHeight: "90vh" }}>
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div
              className={`modal-body ${bodyClassName} custom-scrollbar`}
              style={{ overflowY: "auto", flex: "1 1 auto", maxHeight: "70vh" }}
            >
              {children}
            </div>
            <div className={`modal-footer ${footerClassName}`} style={{ position: "sticky", bottom: 0, background: "#fff" }}>
              <button type="button" className="btn btn-light" onClick={onClose}>
                {cancelLabel}
              </button>
              <button type="submit" className="btn btn-primary px-4" disabled={submitDisabled}>
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
