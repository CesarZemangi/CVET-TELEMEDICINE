import React from "react";

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
  footerClassName = "border-0 p-4 pt-0"
}) {
  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-content ${contentClassName}`}>
          <form onSubmit={onSubmit}>
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className={`modal-body ${bodyClassName}`}>{children}</div>
            <div className={`modal-footer ${footerClassName}`}>
              <button type="button" className="btn btn-light" onClick={onClose}>
                {cancelLabel}
              </button>
              <button type="submit" className="btn btn-primary px-4">
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
