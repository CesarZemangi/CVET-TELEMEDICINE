import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function VetLayout() {
  return (
    <div className="d-flex vh-100 overflow-hidden">
      {/* Sidebar - Fixed on the left (260px wide) */}
      <Sidebar />

      {/* Main Content Area - Needs a margin-left of 260px */}
      <div 
        className="flex-grow-1 d-flex flex-column" 
        style={{ 
          marginLeft: "260px", // MUST match the sidebar width
          backgroundColor: "var(--background-light)", // Cream background
          minHeight: "100vh"
        }}
      >
        <Topbar />
        
        <main className="p-4 overflow-auto">
          {/* Outlet is where the "blank" pages will appear */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}