import React from "react"
import ChatInterface from "../../components/common/ChatInterface"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function Messages() {
  return (
    <DashboardSection title="Farmer Messages">
      <div className="p-4" style={{ backgroundColor: "#1a1a1a" }}>
        <ChatInterface />
      </div>
    </DashboardSection>
  )
}
