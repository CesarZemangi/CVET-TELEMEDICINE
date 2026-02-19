import React, { useState, useEffect } from "react"
import { Pie, Line } from "react-chartjs-2"
import { getFeedInventory, addFeedInventory } from "../services/farmer.nutrition.service"
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
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    feed_name: "",
    quantity: "",
    unit: "kg"
  })

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getFeedInventory()
      const mappedData = data.map(item => ({
        id: item.id,
        item: item.feed_name,
        quantity: `${item.quantity} ${item.unit || 'kg'}`,
        status: item.quantity < 50 ? "Low Stock" : "Available",
        date: new Date(item.created_at).toLocaleDateString()
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
    e.preventDefault();
    try {
      await addFeedInventory(formData);
      setShowModal(false);
      setFormData({ feed_name: "", quantity: "", unit: "kg" });
      fetchInventory();
    } catch (err) {
      alert("Failed to add feed: " + (err.response?.data?.message || err.message));
    }
  };

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
                  {filteredInventory.map(feed => (
                    <li key={feed.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <div>
                        <div className="fw-bold">{feed.item}</div>
                        <small className="text-muted">{feed.quantity}</small>
                      </div>
                      <div className="text-end">
                        <div className={getStatusClass(feed.status)} style={{fontSize: '0.75rem'}}>{feed.status}</div>
                        <small className="text-muted" style={{fontSize: '0.65rem'}}>{feed.date}</small>
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
                  <Pie data={pieData} options={options} />
                </div>
             </div>
           </div>
           
           <div className="card border-0 shadow-sm">
             <div className="card-body">
                <h6>Inventory Timeline</h6>
                <div style={{ height: "200px" }}>
                  <Line data={lineData} options={{ ...options, maintainAspectRatio: false }} />
                </div>
             </div>
           </div>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <form onSubmit={handleAddFeed}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Register Feed Inventory</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Feed Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.feed_name}
                      onChange={e => setFormData({...formData, feed_name: e.target.value})}
                      placeholder="e.g. Maize Bran, Silage"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label className="form-label small fw-bold">Quantity</label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="form-control" 
                        required 
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-bold">Unit</label>
                      <select 
                        className="form-select" 
                        value={formData.unit}
                        onChange={e => setFormData({...formData, unit: e.target.value})}
                      >
                        <option value="kg">kg</option>
                        <option value="tons">tons</option>
                        <option value="bags">bags</option>
                        <option value="liters">liters</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Inventory</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
