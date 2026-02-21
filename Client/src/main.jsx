import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./Styles/theme.css"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"

import Login from "./pages/Login"
import Register from "./pages/Register"

/* Layouts */
import FarmerLayout from "./components/layout/FarmerLayout"
import VetLayout from "./components/layout/VetLayout"
import AdminLayout from "./components/layout/AdminLayout"

/* Dashboards */
import FarmerDashboard from "./pages/FarmerDashboard"
import VetDashboard from "./pages/VetDashboard"
import AdminDashboard from "./pages/AdminDashboard"

/* Farmer Core */
import Animals from "./farmer/Animals"
import Cases from "./farmer/Cases"
import Consultations from "./farmer/Consultations"
import Settings from "./farmer/Settings"

/* Farmer Diagnostics */
import LabRequests from "./farmer/Diagnostics/LabRequests"
import LabTests from "./farmer/Diagnostics/LabTests"
import Vaccinations from "./farmer/Diagnostics/Vaccinations"
import DiseaseHistory from "./farmer/Diagnostics/DiseaseHistory"
import HealthMetrics from "./farmer/Diagnostics/HealthMetrics"
import Screenings from "./farmer/Diagnostics/Screenings"
import DiseaseTrackingFarmer from "./farmer/Diagnostics/DiseaseTracking"
import ImagingReportsFarmer from "./farmer/Diagnostics/ImagingReports"
import LabResultsFarmer from "./farmer/Diagnostics/LabResults"

/* Farmer Treatment */
import Prescriptions from "./farmer/Treatment/Prescriptions"
import TreatmentPlans from "./farmer/Treatment/TreatmentPlans"
import MedicationHistory from "./farmer/Treatment/MedicationHistory"
import FollowUps from "./farmer/Treatment/FollowUps"
import SurgicalCases from "./farmer/Treatment/SurgicalCases"
import MedicationSchedule from "./farmer/Medications/MedicationSchedule"
import PharmacyOrders from "./farmer/Medications/PharmacyOrders"

/* Farmer Analytics */
import HealthTrends from "./farmer/Analytics/HealthTrends"
import TreatmentStats from "./farmer/Analytics/TreatmentStats"
import ReportsExport from "./farmer/Analytics/ReportsExport"
import LivestockPerformance from "./farmer/Analytics/LiveStockPerformance"
import TreatmentEffectivenessFarmer from "./farmer/Analytics/TreatmentEffectiveness"
import ConsultationStats from "./farmer/Analytics/ConsulationStats"

/* Farmer Communication */
import Messages from "./farmer/Communication/Messages"
import Notifications from "./farmer/Communication/Notifications"
import ChatLogsFarmer from "./farmer/Communication/Chatlogs"
import VideoSessionsFarmer from "./farmer/Communication/VideoSessions"
import FeedbackFarmer from "./farmer/Communication/Feedback"

/* Farmer Nutrition */
import DietaryNeeds from "./farmer/Nutrition/DietaryNeeds"
import FeedingInventory from "./farmer/Nutrition/FeedingInventory"
import FeedPlans from "./farmer/Nutrition/FeedPlans"
import NutritionReports from "./farmer/Nutrition/NutritionReports"
import Supplements from "./farmer/Nutrition/Supplements"

/* Vet Core */
import IncomingCases from "./vet/Cases"
import Appointments from "./vet/Appointments"
import VetConsultations from "./vet/Consultations"
import VetSettings from "./vet/Settings"

/* Vet Diagnostics */
import VetLabRequests from "./vet/Diagnostics/LabRequests"
import VetLabResults from "./vet/Diagnostics/LabResults"
import VetImagingReports from "./vet/Diagnostics/ImagingReports"
import VetDiseaseTracking from "./vet/Diagnostics/DiseaseTracking"
import VetPreventiveScreenings from "./vet/Diagnostics/PreventiveScreenings"

/* Vet Treatment */
import VetPrescriptions from "./vet/Treatment/Prescriptions"
import VetTreatmentPlans from "./vet/Treatment/TreatmentPlans"
import VetMedicationHistory from "./vet/Treatment/MedicationHistory"
import VetFollowUps from "./vet/Treatment/FollowUps"
import VetSurgicalCases from "./vet/Treatment/SurgicalCases"

/* Vet Analytics */
import CaseStatistics from "./vet/Analytics/CaseStatistics"
import ConsultationReports from "./vet/Analytics/ConsultationReports"
import TreatmentEffectiveness from "./vet/Analytics/TreatmentEffectiveness"
import AnimalHealthTrends from "./vet/Analytics/AnimalHealthTrends"
import ExportReports from "./vet/Analytics/ExportReports"

/* Vet Communication */
import VetMessages from "./vet/Communication/Messages"
import VetNotifications from "./vet/Communication/Notifications"
import ChatLogs from "./vet/Communication/Chatlogs"
import VideoSessions from "./vet/Communication/VideoSessions"
import Feedback from "./vet/Communication/Feedback"

/* Admin Pages */
import AdminUsers from "./pages/AdminUsers"
import AdminFarmers from "./pages/AdminFarmers"
import AdminVets from "./pages/AdminVets"
import AdminLogs from "./pages/AdminLogs"
import AdminCases from "./pages/AdminCases"
import AdminConsultations from "./pages/AdminConsultations"
import AdminAnalytics from "./pages/AdminAnalytics"
import AdminVetPerformance from "./pages/AdminVetPerformance"
import AdminReminders from "./pages/AdminReminders"
import AdminCommunication from "./pages/AdminCommunication"

function RequireAuth({ role, children }) {
const [isAuthenticated, setIsAuthenticated] = React.useState(null)

React.useEffect(() => {
const checkAuth = () => {
const userData = localStorage.getItem("user")

if (!userData) {
setIsAuthenticated(false)
return
}

let user
try {
user = JSON.parse(userData)
} catch {
localStorage.removeItem("user")
setIsAuthenticated(false)
return
}

if (!user.token) {
setIsAuthenticated(false)
return
}

// Allow specific role OR admin
if (user.role !== role && user.role !== "admin") {
setIsAuthenticated(false)
return
}

setIsAuthenticated(true)
}

checkAuth()
}, [role])

if (isAuthenticated === null) {
return (
<div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "var(--background-light)" }}>
<div className="text-center">
<div className="spinner-border mb-3" role="status">
<span className="visually-hidden">Loading...</span>
</div>
<p className="text-muted">Loading...</p>
</div>
</div>
)
}

if (!isAuthenticated) return <Navigate to="/" replace />

return children
}

export function App() {
return (
<Routes>
<Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />

  <Route
    path="/farmerdashboard/*"
    element={
      <RequireAuth role="farmer">
        <FarmerLayout />
      </RequireAuth>
    }
  >
    <Route index element={<FarmerDashboard />} />
    <Route path="animals" element={<Animals />} />
    <Route path="cases" element={<Cases />} />
    <Route path="consultations" element={<Consultations />} />
    <Route path="settings" element={<Settings />} />

    <Route path="diagnostics/lab-requests" element={<LabRequests />} />
    <Route path="diagnostics/lab-tests" element={<LabTests />} />
    <Route path="diagnostics/vaccinations" element={<Vaccinations />} />
    <Route path="diagnostics/disease-history" element={<DiseaseHistory />} />
    <Route path="diagnostics/health-metrics" element={<HealthMetrics />} />
    <Route path="diagnostics/screenings" element={<Screenings />} />
    <Route path="diagnostics/disease-tracking" element={<DiseaseTrackingFarmer />} />
    <Route path="diagnostics/imaging-reports" element={<ImagingReportsFarmer />} />
    <Route path="diagnostics/lab-results" element={<LabResultsFarmer />} />

    <Route path="treatment/prescriptions" element={<Prescriptions />} />
    <Route path="treatment/plans" element={<TreatmentPlans />} />
    <Route path="treatment/history" element={<MedicationHistory />} />
    <Route path="treatment/follow-ups" element={<FollowUps />} />
    <Route path="treatment/surgical-cases" element={<SurgicalCases />} />
    <Route path="treatment/medication-schedule" element={<MedicationSchedule />} />
    <Route path="treatment/pharmacy-orders" element={<PharmacyOrders />} />

    <Route path="analytics/health-trends" element={<HealthTrends />} />
    <Route path="analytics/treatment-stats" element={<TreatmentStats />} />
    <Route path="analytics/reports" element={<ReportsExport />} />
    <Route path="analytics/livestock-performance" element={<LivestockPerformance />} />
    <Route path="analytics/treatment-effectiveness" element={<TreatmentEffectivenessFarmer />} />
    <Route path="analytics/consultation-stats" element={<ConsultationStats />} />

    <Route path="communication/messages" element={<Messages />} />
    <Route path="communication/notifications" element={<Notifications />} />
    <Route path="communication/chat-logs" element={<ChatLogsFarmer />} />
    <Route path="communication/video-sessions" element={<VideoSessionsFarmer />} />
    <Route path="communication/feedback" element={<FeedbackFarmer />} />

    <Route path="nutrition/dietary-needs" element={<DietaryNeeds />} />
    <Route path="nutrition/feeding-inventory" element={<FeedingInventory />} />
    <Route path="nutrition/feed-plans" element={<FeedPlans />} />
    <Route path="nutrition/reports" element={<NutritionReports />} />
    <Route path="nutrition/supplements" element={<Supplements />} />
  </Route>

  <Route
    path="/vetdashboard/*"
    element={
      <RequireAuth role="vet">
        <VetLayout />
      </RequireAuth>
    }
  >
    <Route index element={<VetDashboard />} />
    <Route path="cases" element={<IncomingCases />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="consultations" element={<VetConsultations />} />
    <Route path="settings" element={<VetSettings />} />

    <Route path="diagnostics/lab-requests" element={<VetLabRequests />} />
    <Route path="diagnostics/lab-results" element={<VetLabResults />} />
    <Route path="diagnostics/imaging-reports" element={<VetImagingReports />} />
    <Route path="diagnostics/disease-tracking" element={<VetDiseaseTracking />} />
    <Route path="diagnostics/preventive-screenings" element={<VetPreventiveScreenings />} />

    <Route path="treatment/prescriptions" element={<VetPrescriptions />} />
    <Route path="treatment/plans" element={<VetTreatmentPlans />} />
    <Route path="treatment/history" element={<VetMedicationHistory />} />
    <Route path="treatment/follow-ups" element={<VetFollowUps />} />
    <Route path="treatment/surgical-cases" element={<VetSurgicalCases />} />

    <Route path="analytics/case-statistics" element={<CaseStatistics />} />
    <Route path="analytics/consultation-reports" element={<ConsultationReports />} />
    <Route path="analytics/treatment-effectiveness" element={<TreatmentEffectiveness />} />
    <Route path="analytics/animal-health-trends" element={<AnimalHealthTrends />} />
    <Route path="analytics/export" element={<ExportReports />} />

    <Route path="communication/messages" element={<VetMessages />} />
    <Route path="communication/notifications" element={<VetNotifications />} />
    <Route path="communication/chat-logs" element={<ChatLogs />} />
    <Route path="communication/video-sessions" element={<VideoSessions />} />
    <Route path="communication/feedback" element={<Feedback />} />
  </Route>

    <Route path="/admindashboard/*"
    element={
      <RequireAuth role="admin">
        <AdminLayout />
      </RequireAuth>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="farmers" element={<AdminFarmers />} />
    <Route path="vets" element={<AdminVets />} />
    <Route path="cases" element={<AdminCases />} />
    <Route path="consultations" element={<AdminConsultations />} />
    <Route path="logs" element={<AdminLogs />} />
    
    <Route path="analytics" element={<AdminAnalytics />} />
    <Route path="reminders" element={<AdminReminders />} />
    <Route path="vet-performance" element={<AdminVetPerformance />} />
    <Route path="media-reports" element={<div>Media Reports Page</div>} />
    <Route path="communication/messages" element={<AdminCommunication />} />
  </Route>

  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>


)
}

ReactDOM.createRoot(document.getElementById("root")).render(
<BrowserRouter>
<App />
</BrowserRouter>
)