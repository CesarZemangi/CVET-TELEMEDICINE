import React, { useState, useEffect } from "react";
import api from "../services/api";
import ChartWrapper from "../components/dashboard/ChartWrapper";

export default function AdminAnalytics() {
  const [caseAnalytics, setCaseAnalytics] = useState(null);
  const [messageAnalytics, setMessageAnalytics] = useState(null);
  const [reminderAnalytics, setReminderAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [caseRes, msgRes, remRes] = await Promise.all([
          api.get("/admin/analytics/cases"),
          api.get("/admin/analytics/messages"),
          api.get("/admin/analytics/reminders")
        ]);
        setCaseAnalytics(caseRes.data);
        setMessageAnalytics(msgRes.data);
        setReminderAnalytics(remRes.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

  const caseTrendData = {
    labels: caseAnalytics?.monthlyCases.map(m => m.month) || [],
    datasets: [{
      label: "New Cases",
      data: caseAnalytics?.monthlyCases.map(m => m.count) || [],
      borderColor: "#228B22",
      backgroundColor: "rgba(34, 139, 34, 0.1)",
      fill: true
    }]
  };

  const priorityData = {
    labels: caseAnalytics?.priorityDistribution.map(p => p.priority.toUpperCase()) || [],
    datasets: [{
      data: caseAnalytics?.priorityDistribution.map(p => p.count) || [],
      backgroundColor: ["#FF4136", "#FF851B", "#FFDC00", "#2ECC40"]
    }]
  };

  const messageTrendData = {
    labels: messageAnalytics?.dailyMessages.map(m => m.date) || [],
    datasets: [{
      label: "Messages",
      data: messageAnalytics?.dailyMessages.map(m => m.count) || [],
      borderColor: "#1E90FF",
      backgroundColor: "rgba(30, 144, 255, 0.1)",
      fill: true
    }]
  };

  const reminderData = {
    labels: reminderAnalytics?.monthlyReminders.map(m => m.month) || [],
    datasets: [{
      label: "Reminders Sent",
      data: reminderAnalytics?.monthlyReminders.map(m => m.count) || [],
      borderColor: "#B10DC9",
      backgroundColor: "rgba(177, 13, 201, 0.1)",
      fill: true
    }]
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h4 className="fw-bold">System Analytics & Trends</h4>
        <p className="text-muted small">Detailed data visualization of system activity and performance.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Monthly Case Growth</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <ChartWrapper type="line" data={caseTrendData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Message Volume Trend (Last 30 Days)</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <ChartWrapper type="line" data={messageTrendData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Priority Distribution</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "250px" }}>
                <ChartWrapper type="doughnut" data={priorityData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Reminder Automation Performance</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "200px" }}>
                <ChartWrapper type="line" data={reminderData} options={{ maintainAspectRatio: false }} />
              </div>
              <div className="mt-4">
                <h6 className="small fw-bold text-uppercase opacity-50 mb-3">Delivery Status</h6>
                {reminderAnalytics?.successRate.map(s => (
                  <div key={s.status} className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-capitalize">{s.status}</span>
                      <span>{s.count}</span>
                    </div>
                    <div className="progress" style={{height: '5px'}}>
                      <div 
                        className={`progress-bar ${s.status === 'sent' ? 'bg-success' : s.status === 'pending' ? 'bg-warning' : 'bg-danger'}`} 
                        style={{width: `${(s.count / reminderAnalytics.successRate.reduce((a,b) => a + parseInt(b.count), 0)) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
