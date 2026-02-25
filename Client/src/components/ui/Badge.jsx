export default function Badge({ status, type = "status", className = "" }) {
  let badgeClass = "badge ";
  
  if (type === "status") {
    switch (status?.toLowerCase()) {
      case "active":
      case "open":
        badgeClass += "bg-success";
        break;
      case "pending":
      case "draft":
        badgeClass += "bg-warning text-dark";
        break;
      case "completed":
      case "closed":
        badgeClass += "bg-secondary";
        break;
      case "cancelled":
      case "rejected":
        badgeClass += "bg-danger";
        break;
      default:
        badgeClass += "bg-secondary";
    }
  } else if (type === "priority") {
    switch (status?.toLowerCase()) {
      case "critical":
      case "high":
        badgeClass += "bg-danger";
        break;
      case "medium":
        badgeClass += "bg-warning text-dark";
        break;
      case "low":
        badgeClass += "bg-info text-dark";
        break;
      default:
        badgeClass += "bg-secondary";
    }
  } else if (type === "mode") {
    switch (status?.toLowerCase()) {
      case "video":
        badgeClass += "bg-primary";
        break;
      case "chat":
        badgeClass += "bg-info text-dark";
        break;
      case "in-person":
        badgeClass += "bg-success";
        break;
      default:
        badgeClass += "bg-secondary";
    }
  }

  return <span className={`${badgeClass} ${className}`}>{status}</span>;
}
