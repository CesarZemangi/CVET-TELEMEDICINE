import React, { useState } from "react"
import DashboardSection from "../../components/dashboard/DashboardSection"
import { Pie, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js"

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export default function PharmacyOrders() {
  const [filter, setFilter] = useState("All")

  const orders = [
    { id: "PO-101", item: "Vitamin Supplements", status: "Pending", date: "25 Jan 2026" },
    { id: "PO-102", item: "Antibiotics", status: "Shipped", date: "22 Jan 2026" },
    { id: "PO-103", item: "Painkillers", status: "Delivered", date: "20 Jan 2026" },
    { id: "PO-104", item: "Dewormer", status: "Pending", date: "24 Jan 2026" },
    { id: "PO-105", item: "Respiratory Medicine", status: "Delivered", date: "18 Jan 2026" },
    { id: "PO-106", item: "Skin Ointment", status: "Shipped", date: "21 Jan 2026" },
    { id: "PO-107", item: "Nutritional Supplements", status: "Delivered", date: "19 Jan 2026" },
    { id: "PO-108", item: "Vaccines", status: "Pending", date: "26 Jan 2026" },
    { id: "PO-109", item: "Anti-parasite Medication", status: "Shipped", date: "23 Jan 2026" },
    { id: "PO-110", item: "Vitamin Booster", status: "Delivered", date: "17 Jan 2026" }
  ]

  const filteredOrders = orders.filter(o =>
    filter === "All" ? true : o.status === filter
  )

  const getStatusClass = (status) => {
    if (status === "Pending") return "text-warning fw-bold"
    if (status === "Shipped") return "text-primary fw-bold"
    if (status === "Delivered") return "text-success fw-bold"
    return ""
  }

  // Summary chart
  const pieData = {
    labels: ["Pending", "Shipped", "Delivered"],
    datasets: [
      {
        data: [
          orders.filter(o => o.status === "Pending").length,
          orders.filter(o => o.status === "Shipped").length,
          orders.filter(o => o.status === "Delivered").length
        ],
        backgroundColor: ["#FFA500", "#1E90FF", "#228B22"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Timeline chart: orders over time
  const lineData = {
    labels: orders.map(o => o.date),
    datasets: [
      {
        label: "Pending",
        data: orders.map(o => (o.status === "Pending" ? 1 : 0)),
        borderColor: "#FFA500",
        backgroundColor: "#FFD580",
        tension: 0.3,
        fill: true
      },
      {
        label: "Shipped",
        data: orders.map(o => (o.status === "Shipped" ? 1 : 0)),
        borderColor: "#1E90FF",
        backgroundColor: "#87CEFA",
        tension: 0.3,
        fill: true
      },
      {
        label: "Delivered",
        data: orders.map(o => (o.status === "Delivered" ? 1 : 0)),
        borderColor: "#228B22",
        backgroundColor: "#90EE90",
        tension: 0.3,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true }
    }
  }

  // Conditional alert
  const pendingCount = orders.filter(o => o.status === "Pending").length

  return (
    <DashboardSection title="Pharmacy Orders (Zimbabwe)">
      <p>Recent pharmacy orders for cattle, goats, and sheep.</p>

      {/* Conditional alert */}
      {pendingCount > 3 && (
        <div className="alert alert-warning fw-bold">
          ⚠️ {pendingCount} orders are still pending. Please follow up with suppliers!
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", "Pending", "Shipped", "Delivered"].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <ul className="list-group">
        {filteredOrders.map(order => (
          <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{order.item}</span>
            <small className={`text-muted ${getStatusClass(order.status)}`}>
              {order.date} — {order.status}
            </small>
          </li>
        ))}
        {filteredOrders.length === 0 && (
          <li className="list-group-item text-muted">No {filter.toLowerCase()} orders found.</li>
        )}
      </ul>

      {/* Summary chart */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Summary</h6>
        <Pie data={pieData} options={options} />
      </div>

      {/* Timeline chart */}
      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Order Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Orders Over Time" } }} />
      </div>
    </DashboardSection>
  )
}
