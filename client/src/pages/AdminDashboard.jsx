import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

const API = "http://localhost:5000";

const AdminDashboard = () => {
  const { logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [view, setView] = useState("home");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, servicesRes, bookingsRes, providersRes] = await Promise.all([
        axios.get(`${API}/api/admin/users`, { headers }),
        axios.get(`${API}/api/admin/services`, { headers }),
        axios.get(`${API}/api/admin/bookings`, { headers }),
        axios.get(`${API}/api/admin/providers/pending`, { headers }),
      ]);
      setUsers(usersRes.data);
      setServices(servicesRes.data);
      setBookings(bookingsRes.data);
      setPendingProviders(providersRes.data);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const approveProvider = async (id) => {
    try {
      await axios.put(`${API}/api/admin/providers/approve/${id}`, {}, { headers });
      setPendingProviders((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to approve provider: " + (err.response?.data?.message || err.message));
    }
  };

  const toggleBlock = async (id) => {
    try {
      await axios.put(`${API}/api/admin/users/block/${id}`, {}, { headers });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: !u.isBlocked } : u))
      );
    } catch (err) {
      alert("Failed to update user: " + (err.response?.data?.message || err.message));
    }
  };

  
  const regularUsers = users.filter((u) => u.role === "user");
  const approvedProviders = users.filter((u) => u.role === "provider" && u.isApproved);

  const statCards = [
    { key: "users",     label: "Users",            count: regularUsers.length,       color: "stat-blue" },
    { key: "providers", label: "Providers",         count: approvedProviders.length,  color: "stat-green" },
    { key: "services",  label: "Services",          count: services.length,           color: "stat-amber" },
    { key: "bookings",  label: "Bookings",          count: bookings.length,           color: "stat-purple" },
    { key: "pending",   label: "Pending Approval",  count: pendingProviders.length,   color: "stat-red" },
  ];

  
  const BackBtn = () => (
    <button className="ad-back-btn" onClick={() => setView("home")}>
      ← Back to Dashboard
    </button>
  );

 
  const renderDetailView = () => {
    switch (view) {

      case "users":
        return (
          <div className="ad-detail">
            <BackBtn />
            <h2 className="ad-detail-title">All Users</h2>
            {regularUsers.length === 0 ? (
              <p className="ad-empty">No users found.</p>
            ) : (
              <div className="ad-list">
                {regularUsers.map((u) => (
                  <div key={u._id} className={`ad-row ${u.isBlocked ? "ad-row--blocked" : ""}`}>
                    <div className="ad-row-avatar">{u.name?.[0]?.toUpperCase() || "U"}</div>
                    <div className="ad-row-info">
                      <span className="ad-row-name">{u.name}</span>
                      <span className="ad-row-email">{u.email}</span>
                    </div>
                    <div className="ad-row-actions">
                      {u.isBlocked && <span className="ad-badge ad-badge--blocked">Blocked</span>}
                      <button
                        className={`ad-btn ${u.isBlocked ? "ad-btn--unblock" : "ad-btn--block"}`}
                        onClick={() => toggleBlock(u._id)}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "providers":
        return (
          <div className="ad-detail">
            <BackBtn />
            <h2 className="ad-detail-title">Approved Providers</h2>
            {approvedProviders.length === 0 ? (
              <p className="ad-empty">No approved providers yet.</p>
            ) : (
              <div className="ad-list">
                {approvedProviders.map((p) => (
                  <div key={p._id} className={`ad-row ${p.isBlocked ? "ad-row--blocked" : ""}`}>
                    <div className="ad-row-avatar ad-row-avatar--provider">{p.name?.[0]?.toUpperCase() || "P"}</div>
                    <div className="ad-row-info">
                      <span className="ad-row-name">{p.name}</span>
                      <span className="ad-row-email">{p.email}</span>
                    </div>
                    <div className="ad-row-actions">
                      {p.isBlocked && <span className="ad-badge ad-badge--blocked">Blocked</span>}
                      <span className="ad-badge ad-badge--provider">Provider</span>
                      <button
                        className={`ad-btn ${p.isBlocked ? "ad-btn--unblock" : "ad-btn--block"}`}
                        onClick={() => toggleBlock(p._id)}
                      >
                        {p.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "pending":
        return (
          <div className="ad-detail">
            <BackBtn />
            <h2 className="ad-detail-title">Pending Provider Approvals</h2>
            {pendingProviders.length === 0 ? (
              <p className="ad-empty">No pending approvals.</p>
            ) : (
              <div className="ad-list">
                {pendingProviders.map((p) => (
                  <div key={p._id} className="ad-row">
                    <div className="ad-row-avatar ad-row-avatar--pending">{p.name?.[0]?.toUpperCase() || "P"}</div>
                    <div className="ad-row-info">
                      <span className="ad-row-name">{p.name}</span>
                      <span className="ad-row-email">{p.email}</span>
                    </div>
                    <div className="ad-row-actions">
                      <span className="ad-badge ad-badge--pending">Pending</span>
                      <button className="ad-btn ad-btn--approve" onClick={() => approveProvider(p._id)}>
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "services":
        return (
          <div className="ad-detail">
            <BackBtn />
            <h2 className="ad-detail-title">All Services</h2>
            {services.length === 0 ? (
              <p className="ad-empty">No services found.</p>
            ) : (
              <div className="ad-list">
                {services.map((s) => (
                  <div key={s._id} className="ad-row">
                    <div className="ad-row-avatar ad-row-avatar--service">S</div>
                    <div className="ad-row-info">
                      <span className="ad-row-name">{s.title}</span>
                      <span className="ad-row-email">by {s.provider?.name || "Unknown"}</span>
                    </div>
                    <div className="ad-row-actions">
                      <span className="ad-badge ad-badge--price">₹{s.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "bookings":
        return (
          <div className="ad-detail">
            <BackBtn />
            <h2 className="ad-detail-title">All Bookings</h2>
            {bookings.length === 0 ? (
              <p className="ad-empty">No bookings found.</p>
            ) : (
              <div className="ad-list">
                {bookings.map((b) => (
                  <div key={b._id} className="ad-row">
                    <div className="ad-row-avatar ad-row-avatar--booking">B</div>
                    <div className="ad-row-info">
                      <span className="ad-row-name">{b.service?.title || "Deleted service"}</span>
                      <span className="ad-row-email">by {b.user?.name || "Unknown user"}</span>
                    </div>
                    <div className="ad-row-actions">
                      <span className={`ad-badge ad-badge--status ad-badge--${b.status}`}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  
  return (
    <div className="ad-root">
      {/* Navbar */}
      <nav className="ad-nav">
        <span className="ad-nav-logo">NeighborHAND<span>Admin</span></span>
        <button className="ad-nav-logout" onClick={logout}>Logout</button>
      </nav>

      <div className="ad-body">
        {loading ? (
          <div className="ad-loading">Loading...</div>
        ) : error ? (
          <div className="ad-error">
            {error}
            <button className="ad-btn ad-btn--approve" onClick={loadData} style={{ marginLeft: 16 }}>Retry</button>
          </div>
        ) : view !== "home" ? (
          renderDetailView()
        ) : (
          <>
            <h1 className="ad-welcome">Welcome, Admin!</h1>

            <div className="ad-stats-grid">
              {statCards.map((card) => (
                <button
                  key={card.key}
                  className={`ad-stat-card ${card.color}`}
                  onClick={() => setView(card.key)}
                >
                  <span className="ad-stat-count">{card.count}</span>
                  <span className="ad-stat-label">{card.label}</span>
                  <span className="ad-stat-arrow">→</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;