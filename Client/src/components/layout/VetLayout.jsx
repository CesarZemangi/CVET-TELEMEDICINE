import { Outlet } from "react-router-dom"
import VetSidebar from "../sidebar/VetSidebar"
import Topbar from "./Topbar";


export default function VetLayout() {
  return (
    <div className="d-flex">
      <VetSidebar />

      <div className="flex-grow-1">
        <Topbar />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
