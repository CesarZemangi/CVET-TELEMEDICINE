import { Outlet } from "react-router-dom"
import FarmerSidebar from "../sidebar/FarmerSidebar"

export default function FarmerLayout() {
  return (
    <div className="d-flex">
      <FarmerSidebar />

      <main
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#F5F5DC", minHeight: "100vh" }}
      >
        <Outlet />
      </main>
    </div>
  )
}
