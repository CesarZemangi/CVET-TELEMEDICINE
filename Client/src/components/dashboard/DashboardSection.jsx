export default function DashboardSection({ title, children }) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h6 className="fw-semibold text-brown mb-3">{title}</h6>
        {children}
      </div>
    </div>
  )
}
