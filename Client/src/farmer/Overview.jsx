import React, { useEffect, useState } from "react";
import { getFarmerDashboardData, getRecentActivity } from "./services/farmer.dashboard.service";

export default function FarmerOverview() {
  const [stats, setStats] = useState({
    totalAnimals: 0,
    activeCases: 0,
    pendingConsultations: 0,
    healthAlerts: 0
  });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          getFarmerDashboardData(),
          getRecentActivity()
        ]);
        setStats(statsData);
        setActivity(activityData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="container-fluid px-4 py-4">

      <div className="mb-4">
        <h4 className="fw-semibold mb-1">Farmer Dashboard</h4>
        <small className="text-muted">
          Overview of your livestock health activity
        </small>
      </div>

      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-piggy-bank fs-3 text-success me-3"></i>
                <div>
                  <small className="text-muted">Total Animals</small>
                  <h4 className="fw-bold mb-0">{stats.totalAnimals}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-file-earmark-medical fs-3 text-warning me-3"></i>
                <div>
                  <small className="text-muted">Active Cases</small>
                  <h4 className="fw-bold mb-0">{stats.activeCases}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-chat-dots fs-3 text-primary me-3"></i>
                <div>
                  <small className="text-muted">Pending Consults</small>
                  <h4 className="fw-bold mb-0">{stats.pendingConsultations}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle fs-3 text-danger me-3"></i>
                <div>
                  <small className="text-muted">Health Alerts</small>
                  <h4 className="fw-bold mb-0">{stats.healthAlerts}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <h6 className="fw-semibold mb-3">
            Recent Activity
          </h6>

          <ul className="list-group list-group-flush">
            {activity.length > 0 ? (
              activity.map((item, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{item.message}</span>
                  <small className="text-muted">
                    {new Date(item.date).toLocaleDateString()}
                  </small>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No recent activity</li>
            )}
          </ul>

        </div>
      </div>

    </div>
  );
}
