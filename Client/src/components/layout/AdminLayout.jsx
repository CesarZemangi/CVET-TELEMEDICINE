import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import NavigationControls from "../common/NavigationControls"

export default function AdminLayout() {
  return (
    <div className="d-flex vh-100 overflow-hidden">
      <Sidebar />

      <div
        className="flex-grow-1 d-flex flex-column overflow-auto"
        style={{
          marginLeft: "260px",
          backgroundColor: "var(--background-light)",
          minHeight: "100vh"
        }}
      >
        <Topbar />

        <main className="p-4">
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>
        <NavigationControls />
      </div>
    </div>
  )
}
