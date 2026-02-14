import React, { useState, useEffect } from "react"
import { Pie, Line } from "react-chartjs-2"
import { getFeedInventory } from "../services/farmer.nutrition.service"
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
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getFeedInventory()
        // Map backend data to frontend structure if needed
        const mappedData = data.map(item => ({
          id: item.id,
          item: item.feed_name,
          quantity: `${item.quantity} ${item.unit}`,
          status: item.quantity < 50 ? "Low Stock" : "Available", // Simplified status logic
          date: new Date(item.created_at).toLocaleDateString()
        }))
        setInventory(mappedData)
      } catch (error) {
        console.error("Error fetching inventory:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInventory()
  }, [])

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
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-brown" role="status"></div>
        </div>
      ) : (
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
      )}

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
