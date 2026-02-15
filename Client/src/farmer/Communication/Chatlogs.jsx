import { useState, useEffect } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import api from "../../services/api"

export default function ChatLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/communication/chatlogs")
        setLogs(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  return (
    <DashboardSection title="Chat Logs (Zimbabwe)">
      <p>Archived veterinary communication records.</p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-brown"></div>
        </div>
      ) : (
        <ul className="list-group">
          {logs.map(log => (
            <li
              key={log.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{log.sender?.name || "User"}:</strong> {log.message}
              </span>
              <small className="text-muted">
                {new Date(log.created_at).toLocaleString()} , {log.is_read ? "Read" : "Unread"}
              </small>
            </li>
          ))}

          {logs.length === 0 && (
            <li className="list-group-item text-muted text-center py-4">
              No chat logs found in your history.
            </li>
          )}
        </ul>
      )}
    </DashboardSection>
  )
}
