import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function VetLayout() {
  return (
    <div className="d-flex vh-100">
      {/* Sidebar is fixed at 260px */}
      <Sidebar />

      {/* This container must have a margin-left of 260px */}
      <div 
        className="d-flex flex-column flex-grow-1" 
        style={{ 
          marginLeft: "260px", 
          minHeight: "100vh",
          backgroundColor: "var(--background-light)" 
        }}
      >
        <Topbar />
        
        {/* Main scrollable area */}
        <main className="p-4 flex-grow-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}