import React, { useEffect, useState } from "react"
import { Pie, Bar } from "react-chartjs-2"
import { getFeedInventory, addFeedInventory } from "../services/farmer.nutrition.service"
import FormModalWrapper from "../../components/common/FormModalWrapper"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
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
  BarElement,
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
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    feed_name: "",
    quantity: "",
    unit: "kg",
    low_stock_threshold: 10,
    status: "active",
    location: "",
    expiry_date: "",
    notes: ""
  })

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await getFeedInventory()
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.rows)
            ? response.rows
            : []

      const mappedData = list.map((item) => ({
        id: item.id,
        item: item.feed_name,
        quantity: item.quantity,
        displayQuantity: `${item.quantity} ${item.unit || "kg"}`,
        status: parseFloat(item.quantity) < parseFloat(item.low_stock_threshold || 10) ? "Low Stock" : "Available",
        recordStatus: item.status || "active",
        date: new Date(item.created_at).toLocaleDateString(),
        low_stock_threshold: item.low_stock_threshold,
        location: item.location || "",
        expiryDate: item.expiry_date || null,
        notes: item.notes || ""
      }))
      setInventory(mappedData)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleAddFeed = async (e) => {
    e.preventDefault()
    try {
      await addFeedInventory(formData)
      setShowModal(false)
      setFormData({
        feed_name: "",
        quantity: "",
        unit: "kg",
        low_stock_threshold: 10,
        status: "active",
        location: "",
        expiry_date: "",
        notes: ""
      })
      fetchInventory()
    } catch (err) {
      alert("Failed to add feed: " + (err.response?.data?.error || err.response?.data?.message || err.message))
    }
  }

  const filteredInventory = inventory.filter((feed) =>
    filter === "All" ? true : feed.status === filter
  )

  const getStatusClass = (status) => {
    if (status === "Low Stock") return "text-warning fw-bold"
    if (status === "Pending Order") return "text-primary fw-bold"
    if (status === "Available") return "text-success fw-bold"
    return ""
  }

  const statuses = ["Available", "Low Stock", "Pending Order"]
  const pieData = {
    labels: statuses,
    datasets: [
      {
        data: statuses.map((s) => inventory.filter((feed) => feed.status === s).length),
        backgroundColor: ["#228B22", "#FFA500", "#1E90FF"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  }

  const barData = {
    labels: inventory.map((feed) => feed.item),
    datasets: [
      {
        label: "Current Quantity",
        data: inventory.map((feed) => parseFloat(feed.quantity)),
        backgroundColor: "rgba(34, 139, 34, 0.6)",
        borderColor: "#228B22",
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Feed Items",
          font: { weight: "bold" }
        }
      },
      y: {
        title: {
          display: true,
          text: "Quantity Levels",
          font: { weight: "bold" }
        },
        beginAtZero: true
      }
    }
  }

  const lowStockCount = inventory.filter((feed) => feed.status === "Low Stock").length
  const pendingCount = inventory.filter((feed) => feed.status === "Pending Order").length

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Feeding Inventory</h4>
          <p className="text-muted small">Track available feed stock and usage</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i> Register Feed
        </button>
      </div>

      {(lowStockCount > 0 || pendingCount > 0) && (
        <div className="alert alert-warning fw-bold">
          Warning: {lowStockCount} items are low stock and {pendingCount} pending orders. Review feed supply!
        </div>
      )}

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["All", ...statuses].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {filteredInventory.map((feed) => (
                    <li key={feed.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <div>
                        <div className="fw-bold">{feed.item}</div>
                        <small className="text-muted d-block">{feed.displayQuantity} (Threshold: {feed.low_stock_threshold})</small>
                        <small className="text-muted d-block">Status: {feed.recordStatus}</small>
                        {feed.location && <small className="text-muted d-block">Location: {feed.location}</small>}
                        {feed.expiryDate && <small className="text-muted d-block">Expiry: {new Date(feed.expiryDate).toLocaleDateString()}</small>}
                        {feed.notes && <small className="text-muted d-block">Notes: {feed.notes}</small>}
                      </div>
                      <div className="text-end">
                        <div className={getStatusClass(feed.status)} style={{ fontSize: "0.75rem" }}>{feed.status}</div>
                        <small className="text-muted" style={{ fontSize: "0.65rem" }}>{feed.date}</small>
                      </div>
                    </li>
                  ))}
                  {filteredInventory.length === 0 && (
                    <li className="list-group-item text-muted text-center py-4">No {filter.toLowerCase()} items found.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6>Status Summary</h6>
              <div style={{ height: "200px" }}>
                <Pie data={pieData} options={{ ...options, scales: undefined }} />
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6>Inventory Levels</h6>
              <div style={{ height: "200px" }}>
                <Bar data={barData} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormModalWrapper
        show={showModal}
        title="Register Feed Inventory"
        onClose={() => setShowModal(false)}
        onSubmit={handleAddFeed}
        submitLabel="Save Inventory"
      >
        <div className="mb-3">
          <label className="form-label small fw-bold">Feed Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={formData.feed_name}
            onChange={(e) => setFormData({ ...formData, feed_name: e.target.value })}
            placeholder="e.g. Maize Bran, Silage"
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold">Quantity</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold">Low Stock Threshold</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              required
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
              placeholder="10.00"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Unit</label>
          <select
            className="form-select"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          >
            <option value="kg">kg</option>
            <option value="tons">tons</option>
            <option value="bags">bags</option>
            <option value="liters">liters</option>
          </select>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label small fw-bold">Location</label>
            <input
              type="text"
              className="form-control"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Store Room A"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Expiry Date</label>
          <input
            type="date"
            className="form-control"
            value={formData.expiry_date}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Notes</label>
          <textarea
            className="form-control"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Optional storage or handling notes"
          ></textarea>
        </div>
      </FormModalWrapper>
    </div>
  )
}
