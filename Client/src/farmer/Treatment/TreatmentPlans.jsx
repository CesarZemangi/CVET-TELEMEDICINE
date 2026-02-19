import React, { useState, useEffect } from "react"
import api from "../../services/api"
import DashboardSection from "../../components/dashboard/DashboardSection"

export default function TreatmentPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/farmer/treatment/plans");
        setPlans(res.data);
      } catch (err) {
        console.error("Error fetching treatment plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <DashboardSection title="Treatment Plans">
      <p>Follow prescribed treatment plans for your livestock.</p>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Animal</th>
                  <th>Condition/Case</th>
                  <th>Plan Details</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                {plans.length > 0 ? plans.map(plan => (
                  <tr key={plan.id}>
                    <td>{plan.Case?.Animal?.species} ({plan.Case?.Animal?.tag_number})</td>
                    <td>{plan.Case?.title || 'Untitiled Case'}</td>
                    <td>
                      <div className="fw-bold">{plan.plan_details}</div>
                      <small className="text-muted">Start: {new Date(plan.start_date).toLocaleDateString()}</small>
                    </td>
                    <td>
                      <span className="badge bg-info">Active</span>
                      <div className="small text-muted">End: {new Date(plan.end_date).toLocaleDateString()}</div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-4 text-muted">No treatment plans found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardSection>
  )
}
