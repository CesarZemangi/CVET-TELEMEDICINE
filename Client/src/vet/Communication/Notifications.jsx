import DashboardSection from "../../components/dashboard/DashboardSection";

export default function Notifications() {
  const notifications = [
    { id: 1, message: "New mastitis case reported in Nguni cattle herd (Farmer Tendai Moyo)", date: "02 Jan 2026", priority: "Critical" },
    { id: 2, message: "Goat deworming schedule updated for Farmer Rudo Chikafu", date: "03 Jan 2026", priority: "Routine" },
    { id: 3, message: "Vaccination campaign reminder: Foot-and-Mouth in Mashonaland East", date: "04 Jan 2026", priority: "Reminder" },
    { id: 4, message: "Lab results ready for poultry Newcastle disease tests (Farmer Blessing Ncube)", date: "05 Jan 2026", priority: "Routine" },
    { id: 5, message: "Follow-up consultation required for dairy cow fertility case (Farmer Tatenda Dube)", date: "06 Jan 2026", priority: "Reminder" },
    { id: 6, message: "Tick infestation alert in communal dipping tank, Matabeleland South", date: "07 Jan 2026", priority: "Critical" },
    { id: 7, message: "Surgical case scheduled: calf hernia repair (Farmer Nyasha Sibanda)", date: "08 Jan 2026", priority: "Routine" },
    { id: 8, message: "Nutrition plan update for indigenous chickens (Farmer Chipo Mutasa)", date: "09 Jan 2026", priority: "Routine" },
    { id: 9, message: "Emergency case: suspected rabies exposure in goat herd (Farmer Tafadzwa Mhlanga)", date: "10 Jan 2026", priority: "Critical" },
    { id: 10, message: "Monthly herd health report ready for review (Farmer Kudakwashe Dlamini)", date: "11 Jan 2026", priority: "Reminder" }
  ]

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Critical": return "badge bg-danger"
      case "Routine": return "badge bg-secondary"
      case "Reminder": return "badge bg-warning text-dark"
      default: return "badge bg-light text-dark"
    }
  }

  return (
    <DashboardSection title="Notifications">
      <p className="mb-3">Veterinary notifications and case updates:</p>
      <ul className="list-group">
        {notifications.map(note => (
          <li key={note.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{note.message}</span>
            <div>
              <span className={getPriorityClass(note.priority)}>{note.priority}</span>
              <small className="text-muted ms-2">{note.date}</small>
            </div>
          </li>
        ))}
      </ul>
    </DashboardSection>
  )
}
