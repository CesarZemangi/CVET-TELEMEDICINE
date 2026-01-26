import React, { useState } from "react"
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

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

export default function FeedingInventory() {
  const [filter, setFilter] = useState("All")

  const inventory = [
    { id: 1, item: "Hay", quantity: "120 kg", status: "Available", date: "10 Jan 2026" },
    { id: 2, item: "Silage", quantity: "200 kg", status: "Available", date: "11 Jan 2026" },
    { id: 3, item: "Corn Feed", quantity: "150 kg", status: "Low Stock", date: "12 Jan 2026" },
    { id: 4, item: "Soybean Meal", quantity: "80 kg", status: "Available", date: "13 Jan 2026" },
    { id: 5, item: "Mineral Mix", quantity: "50 kg", status: "Available", date: "14 Jan 2026" },
    { id: 6, item: "Salt Lick", quantity: "30 blocks", status: "Available", date: "15 Jan 2026" },
    { id: 7, item: "Wheat Bran", quantity: "90 kg", status: "Available", date: "16 Jan 2026" },
    { id: 8, item: "Cottonseed Cake", quantity: "60 kg", status: "Available", date: "17 Jan 2026" },
    { id: 9, item: "Molasses", quantity: "40 L", status: "Available", date: "18 Jan 2026" },
    { id: 10, item: "Green Fodder", quantity: "300 kg", status: "Available", date: "19 Jan 2026" },
    { id: 11, item: "Barley Feed", quantity: "70 kg", status: "Low Stock", date: "20 Jan 2026" },
    { id: 12, item: "Peanut Cake", quantity: "55 kg", status: "Available", date: "21 Jan 2026" },
    { id: 13, item: "Rice Bran", quantity: "100 kg", status: "Available", date: "22 Jan 2026" },
    { id: 14, item: "Fish Meal", quantity: "25 kg", status: "Available", date: "23 Jan 2026" },
    { id: 15, item: "Vitamin Supplements", quantity: "20 packs", status: "Pending Order", date: "24 Jan 2026" }
  ]

  const filteredInventory = inventory.filter(feed =>
    filter === "All" ? true : feed.status === filter
  )

  const getStatusClass = (status) => {
    if (status === "Low Stock") return "text-warning fw-bold"
    if (status === "Pending Order") return "text-primary fw-bold"
    if (status === "Available") return "text-success fw-bold"
    return ""
  }

  // Pie chart: status distribution
  const statuses = ["Available", "Low Stock", "Pending Order"]
  const pieData = {
    labels: statuses,
    datasets: [
      {
        data: statuses.map(s => inventory.filter(feed => feed.status === s).length),
        backgroundColor: ["#228B22", "#FFA500", "#1E90FF"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  // Timeline chart: feed restock/flag dates
  const lineData = {
    labels: inventory.map(feed => feed.date),
    datasets: [
      {
        label: "Feed Items Logged",
        data: inventory.map(() => 1),
        borderColor: "#A0522D",
        backgroundColor: "#CD853F",
        tension: 0.3,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    }
  }

  const lowStockCount = inventory.filter(feed => feed.status === "Low Stock").length
  const pendingCount = inventory.filter(feed => feed.status === "Pending Order").length

  return (
    <div>
      <h4>Feeding Inventory (Zimbabwe)</h4>
      <p>Track available feed stock and usage:</p>

      {/* Conditional alert */}
      {(lowStockCount > 2 || pendingCount > 1) && (
        <div className="alert alert-warning fw-bold">
          ⚠️ {lowStockCount} items are low stock and {pendingCount} pending orders. Review feed supply!
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", ...statuses].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-brown" : "btn-outline-brown"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Inventory list */}
      <ul className="list-group">
        {filteredInventory.map(feed => (
          <li key={feed.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{feed.item} • {feed.quantity}</span>
            <small className={getStatusClass(feed.status)}>{feed.status} • {feed.date}</small>
          </li>
        ))}
        {filteredInventory.length === 0 && (
          <li className="list-group-item text-muted">No {filter.toLowerCase()} items found.</li>
        )}
      </ul>

      {/* Charts */}
      <div className="mt-4" style={{ width: "300px", height: "250px" }}>
        <h6>Status Summary</h6>
        <Pie data={pieData} options={options} />
      </div>

      <div className="mt-4" style={{ width: "500px", height: "300px" }}>
        <h6>Inventory Timeline</h6>
        <Line data={lineData} options={{ ...options, title: { text: "Feed Inventory Over Time" } }} />
      </div>
    </div>
  )
}
