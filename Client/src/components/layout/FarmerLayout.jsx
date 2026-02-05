import { Outlet } from "react-router-dom"
import Sidebar from "../layout/Sidebar" // Use the unified Sidebar we created
import Topbar from "./Topbar"

export default function FarmerLayout() {
  return (
    <div className="d-flex vh-100 overflow-hidden">
      {/* Sidebar is fixed, so it doesn't need to be in a wrapper here */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className="flex-grow-1 d-flex flex-column overflow-auto" 
        style={{ 
          marginLeft: "260px", // Matches the width of your Sidebar
          backgroundColor: "var(--background-light)", // Cream background from theme.css
          minHeight: "100vh"
        }}
      >
        <Topbar />

        <main className="p-4">
          <div className="container-fluid">
            {/* This is where your actual page content (Dashboard, Livestock, etc.) renders */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}