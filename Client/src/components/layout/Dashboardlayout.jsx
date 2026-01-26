import Sidebar from "../sidebar/Sidebar"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />

      <main
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#F5F5DC" }}
      >
        <Outlet />
      </main>
    </div>
  )
}
