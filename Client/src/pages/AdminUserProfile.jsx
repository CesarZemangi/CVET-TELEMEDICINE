import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function AdminUserProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const candidates = [
          `/admin/users/${id}/profile`,
          `/admin/users/profile/${id}`,
          `/admin/user-profile/${id}`,
          `/admin/users/${id}`
        ];

        let loaded = null;
        for (const endpoint of candidates) {
          try {
            const res = await api.get(endpoint);
            loaded = res.data || null;
            if (loaded) break;
          } catch {
            // try next endpoint
          }
        }

        if (!loaded) {
          throw new Error("Profile endpoint not found");
        }

        if (loaded.user || loaded.profile || loaded.stats) {
          setData(loaded);
        } else {
          setData({
            user: loaded,
            profile: null,
            profile_created: false,
            stats: { caseCount: loaded.caseCount || 0, messageCount: loaded.messageCount || 0 }
          });
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="container-fluid px-4 py-4">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-4 py-4">
        <div className="alert alert-danger">{error}</div>
        <Link className="btn btn-outline-secondary btn-sm" to="/admindashboard/users">Back to Users</Link>
      </div>
    );
  }

  const user = data?.user || {};
  const profile = data?.profile || null;
  const stats = data?.stats || {};

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">User Profile</h4>
          <small className="text-muted">Admin view for user #{user.id}</small>
        </div>
        <Link className="btn btn-outline-secondary btn-sm" to="/admindashboard/users">Back to Users</Link>
      </div>

      {data?.profile_created && (
        <div className="alert alert-info py-2">Profile record was missing and has been created automatically.</div>
      )}

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Account</div>
            <div className="card-body">
              <p className="mb-1"><strong>Name:</strong> {user.name || "N/A"}</p>
              <p className="mb-1"><strong>Email:</strong> {user.email || "N/A"}</p>
              <p className="mb-1"><strong>Role:</strong> {user.role || "N/A"}</p>
              <p className="mb-1"><strong>Status:</strong> {user.status || "N/A"}</p>
              <p className="mb-1"><strong>Phone:</strong> {user.phone || "N/A"}</p>
              <p className="mb-0"><strong>Joined:</strong> {user.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Role Profile</div>
            <div className="card-body">
              {!profile && <p className="mb-0 text-muted">No role-specific profile required.</p>}
              {user.role === "farmer" && profile && (
                <>
                  <p className="mb-1"><strong>Farm Name:</strong> {profile.farm_name || "N/A"}</p>
                  <p className="mb-1"><strong>Location:</strong> {profile.location || "N/A"}</p>
                  <p className="mb-0"><strong>Livestock Count:</strong> {profile.livestock_count ?? 0}</p>
                </>
              )}
              {user.role === "vet" && profile && (
                <>
                  <p className="mb-1"><strong>Specialization:</strong> {profile.specialization || "N/A"}</p>
                  <p className="mb-1"><strong>License Number:</strong> {profile.license_number || "N/A"}</p>
                  <p className="mb-0"><strong>Experience Years:</strong> {profile.experience_years ?? 0}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Activity</div>
            <div className="card-body">
              <p className="mb-1"><strong>Case Count:</strong> {stats.caseCount ?? 0}</p>
              <p className="mb-0"><strong>Message Count:</strong> {stats.messageCount ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
