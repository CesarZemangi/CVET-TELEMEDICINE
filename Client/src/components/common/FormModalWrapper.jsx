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
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000, overflowY: "auto" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable w-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-content ${contentClassName}`}>
          <form
            onSubmit={onSubmit}
            className="d-flex flex-column"
            style={{ maxHeight: "calc(100vh - 2rem)" }}
          >
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className={`modal-body ${bodyClassName}`} style={{ overflowY: "auto", flex: "1 1 auto" }}>
              {children}
            </div>
            <div className={`modal-footer ${footerClassName}`} style={{ position: "sticky", bottom: 0, background: "#fff" }}>
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
