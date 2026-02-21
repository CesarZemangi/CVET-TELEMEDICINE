import React from "react"
import ChatInterface from "../../components/common/ChatInterface"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function Messages() {
  return (
    <DashboardSection title="Vet Messages">
      <div className="p-4">
        <ChatInterface />
      </div>
    </DashboardSection>
  )
}
