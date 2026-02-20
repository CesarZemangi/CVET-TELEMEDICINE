import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import Sidebar from "../layout/Sidebar"
import Topbar from "./Topbar"
import NavigationControls from "../common/NavigationControls"

export default function VetLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ position: "relative" }}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1099 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div style={{ 
        position: isMobile ? "fixed" : "relative",
        zIndex: isMobile ? 1100 : "auto",
        transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.3s ease",
        width: "260px",
        height: "100vh"
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div
        className="flex-grow-1 d-flex flex-column overflow-auto"
        style={{
          marginLeft: isMobile ? 0 : "260px",
          backgroundColor: "var(--background-light)",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease"
        }}
      >
        <Topbar 
          isMobile={isMobile} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        />

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
