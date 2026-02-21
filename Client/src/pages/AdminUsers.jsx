import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await api.put(`/admin/users/${user.id}`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h4 className="fw-bold">User Management</h4>
        <p className="text-muted small">Manage all registered users and their account statuses.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading users...</td></tr>
                ) : users.length > 0 ? users.map(u => (
                  <tr key={u.id}>
                    <td className="ps-4 fw-bold">{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge bg-secondary bg-opacity-10 text-secondary text-uppercase" style={{fontSize: '0.7rem'}}>{u.role}</span></td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="text-end pe-4">
                      <button 
                        className={`btn btn-sm ${u.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'} me-2`}
                        onClick={() => toggleStatus(u)}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-sm btn-outline-primary">View Profile</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-4">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white border-0 py-3 text-center">
          <span className="small text-muted">Showing all {users.length} users</span>
        </div>
      </div>
    </div>
  );
}
