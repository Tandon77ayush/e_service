import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/provider.css";

const API = "http://localhost:5000/api"; 

const ProviderDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

 
  const [bookingError, setBookingError] = useState("");
  const [serviceError, setServiceError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ bio: "", experience: "", skills: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: "", category: "", description: "", price: "", experience: "", location: "",
  });
  const [serviceMsg, setServiceMsg] = useState("");
  const [creatingService, setCreatingService] = useState(false);

  
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editServiceForm, setEditServiceForm] = useState({
    title: "", category: "", description: "", price: "", experience: "", location: "",
  });
  const [savingService, setSavingService] = useState(false);

  
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    loadBookings();
    loadMyServices();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        bio: user.bio || "",
        experience: user.experience || "",
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
      });
    }
  }, [user]);

  const loadBookings = async () => {
    setBookingError("");
    try {
      const res = await axios.get(`${API}/bookings/provider`, { headers });
      setBookings(res.data);
    } catch (err) {
      
      setBookingError("Failed to load bookings. Please refresh.");
    }
  };

  const loadMyServices = async () => {
    setServiceError("");
    try {
      const res = await axios.get(`${API}/services/my/services`, { headers });
      setServices(res.data);
    } catch (err) {
      setServiceError("Failed to load services. Please refresh.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/bookings/${id}`, { status }, { headers });
      loadBookings();
    } catch (err) {
      console.log("Status update error:", err.message);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    const snapshot = { ...user };
    const updatedData = {
      ...user,
      bio: profileForm.bio,
      experience: profileForm.experience,
      skills: profileForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    updateUser(updatedData);
    setEditMode(false);
    try {
      await axios.put(`${API}/provider/profile`, profileForm, { headers });
      setSaveMsg("Profile updated!");
    } catch (err) {
  
      updateUser(snapshot);
      setEditMode(true);
      setSaveMsg(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  const createService = async () => {
    if (!serviceForm.title || !serviceForm.category || !serviceForm.description || !serviceForm.price) {
      setServiceMsg("Please fill all required fields");
      return;
    }
    setCreatingService(true);
    try {
      const res = await axios.post(`${API}/services`, serviceForm, { headers });
      setServices((prev) => [res.data, ...prev]);
      setServiceForm({ title: "", category: "", description: "", price: "", experience: "", location: "" });
      setShowServiceForm(false);
      setServiceMsg("Service created! It's now visible to users.");
    } catch (err) {
      setServiceMsg(err.response?.data?.message || "Failed to create service");
    } finally {
      setCreatingService(false);
      setTimeout(() => setServiceMsg(""), 4000);
    }
  };

 
  const startEditService = (s) => {
    setEditingServiceId(s._id);
    setEditServiceForm({
      title: s.title,
      category: s.category,
      description: s.description,
      price: s.price,
      experience: s.experience || "",
      location: s.location || "",
    });
  };

  
  const saveEditService = async (id) => {
    if (!editServiceForm.title || !editServiceForm.category || !editServiceForm.description || !editServiceForm.price) {
      setServiceMsg("Please fill all required fields");
      return;
    }
    setSavingService(true);
    try {
      const res = await axios.put(`${API}/services/${id}`, editServiceForm, { headers });
      setServices((prev) => prev.map((s) => (s._id === id ? res.data : s)));
      setEditingServiceId(null);
      setServiceMsg("Service updated!");
    } catch (err) {
      setServiceMsg(err.response?.data?.message || "Failed to update service");
    } finally {
      setSavingService(false);
      setTimeout(() => setServiceMsg(""), 4000);
    }
  };

  const deleteService = async (id) => {
    try {
      await axios.delete(`${API}/services/${id}`, { headers });
      setServices((prev) => prev.filter((s) => s._id !== id));
      setConfirmDeleteId(null);
      // FIX 4 — show success feedback after delete
      setServiceMsg("Service deleted.");
      setTimeout(() => setServiceMsg(""), 3000);
    } catch (err) {
      
      setConfirmDeleteId(null);
      setServiceMsg(err.response?.data?.message || "Failed to delete service");
      setTimeout(() => setServiceMsg(""), 4000);
    }
  };

  const pending = bookings.filter((b) => b.status === "pending");
  const accepted = bookings.filter((b) => b.status === "accepted");
  const completed = bookings.filter((b) => b.status === "completed");

  
  const totalEarnings = completed.reduce((sum, b) => sum + (b.service?.price || 0), 0);

  const profile = {
    bio: user?.bio || "",
    experience: user?.experience || "",
    skills: Array.isArray(user?.skills) ? user.skills : [],
  };

  return (
    <div className="provider-dashboard">
      <nav className="provider-navbar">
        <h2>Welcome, {user?.name} 👨‍🔧</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </nav>

      <div className="provider-content">

        
        <section className="provider-section">
          <div className="section-header">
            <h2>Profile</h2>
            {!editMode && <button className="edit-btn" onClick={() => setEditMode(true)}>✏️ Edit</button>}
          </div>
          {editMode ? (
            <div className="profile-form">
              <label>Bio</label>
              <textarea rows={3} value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Tell clients about yourself..." />
              <label>Experience</label>
              <input type="text" value={profileForm.experience}
                onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                placeholder="e.g. 5 years in plumbing" />
              <label>Skills <span className="hint">(comma separated)</span></label>
              <input type="text" value={profileForm.skills}
                onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                placeholder="e.g. Plumbing, Electrical, Carpentry" />
              <div className="form-actions">
                <button className="save-btn" onClick={saveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
              {saveMsg && <p className="save-msg">{saveMsg}</p>}
            </div>
          ) : (
            <>
              <p><b>Bio:</b> {profile.bio || "No bio added yet"}</p>
              <p><b>Experience:</b> {profile.experience || "Not added yet"}</p>
              <p><b>Skills:</b> {profile.skills.length ? profile.skills.join(", ") : "Not added yet"}</p>
              {saveMsg && <p className="save-msg">{saveMsg}</p>}
            </>
          )}
        </section>

        
        <section className="provider-section">
          <h2>Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{bookings.length}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
            <div className="stat-card pending">
              <span className="stat-number">{pending.length}</span>
              <span className="stat-label">Pending Requests</span>
            </div>
            <div className="stat-card accepted">
              <span className="stat-number">{accepted.length}</span>
              <span className="stat-label">Active Jobs</span>
            </div>
            <div className="stat-card completed">
              <span className="stat-number">{completed.length}</span>
              <span className="stat-label">Completed Jobs</span>
            </div>
            <div className="stat-card earnings">
              <span className="stat-number">₹{totalEarnings}</span>
              <span className="stat-label">Total Earnings</span>
            </div>
          </div>
          {bookingError && <p className="save-msg" style={{ marginTop: "0.5rem" }}>{bookingError}</p>}
        </section>

        
        <section className="provider-section">
          <div className="section-header">
            <h2>My Services</h2>
            <button className="edit-btn" onClick={() => setShowServiceForm((v) => !v)}>
              {showServiceForm ? "✕ Cancel" : "+ Add Service"}
            </button>
          </div>

          {serviceMsg && <p className="save-msg" style={{ marginBottom: "1rem" }}>{serviceMsg}</p>}
          {serviceError && <p className="save-msg" style={{ marginBottom: "1rem" }}>{serviceError}</p>}

          {showServiceForm && (
            <div className="profile-form service-form">
              <div className="form-row">
                <div>
                  <label>Title <span className="required">*</span></label>
                  <input type="text" value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    placeholder="e.g. Home Plumbing Repair" />
                </div>
                <div>
                  <label>Category <span className="required">*</span></label>
                  <select value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}>
                    <option value="">Select category</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <label>Description <span className="required">*</span></label>
              <textarea rows={3} value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Describe what you offer..." />
              <div className="form-row">
                <div>
                  <label>Price (₹) <span className="required">*</span></label>
                  <input type="number" value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="e.g. 499" />
                </div>
                <div>
                  <label>Experience (years)</label>
                  <input type="number" value={serviceForm.experience}
                    onChange={(e) => setServiceForm({ ...serviceForm, experience: e.target.value })}
                    placeholder="e.g. 3" />
                </div>
              </div>
              <label>Location</label>
              <input type="text" value={serviceForm.location}
                onChange={(e) => setServiceForm({ ...serviceForm, location: e.target.value })}
                placeholder="e.g. Delhi, Mumbai" />
              <div className="form-actions">
                <button className="save-btn" onClick={createService} disabled={creatingService}>
                  {creatingService ? "Creating..." : "Create Service"}
                </button>
                <button className="cancel-btn" onClick={() => setShowServiceForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {services.length === 0 && !serviceError ? (
            <p className="empty-text">No services yet — click "+ Add Service" above</p>
          ) : (
            services.map((s) => (
              <div key={s._id} className="provider-card">
                {editingServiceId === s._id ? (
                  // FIX 5 — inline edit form
                  <div className="profile-form service-form" style={{ width: "100%" }}>
                    <div className="form-row">
                      <div>
                        <label>Title <span className="required">*</span></label>
                        <input type="text" value={editServiceForm.title}
                          onChange={(e) => setEditServiceForm({ ...editServiceForm, title: e.target.value })} />
                      </div>
                      <div>
                        <label>Category <span className="required">*</span></label>
                        <select value={editServiceForm.category}
                          onChange={(e) => setEditServiceForm({ ...editServiceForm, category: e.target.value })}>
                          <option value="">Select category</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Carpentry">Carpentry</option>
                          <option value="Painting">Painting</option>
                          <option value="Pest Control">Pest Control</option>
                          <option value="AC Repair">AC Repair</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <label>Description <span className="required">*</span></label>
                    <textarea rows={3} value={editServiceForm.description}
                      onChange={(e) => setEditServiceForm({ ...editServiceForm, description: e.target.value })} />
                    <div className="form-row">
                      <div>
                        <label>Price (₹) <span className="required">*</span></label>
                        <input type="number" value={editServiceForm.price}
                          onChange={(e) => setEditServiceForm({ ...editServiceForm, price: e.target.value })} />
                      </div>
                      <div>
                        <label>Experience (years)</label>
                        <input type="number" value={editServiceForm.experience}
                          onChange={(e) => setEditServiceForm({ ...editServiceForm, experience: e.target.value })} />
                      </div>
                    </div>
                    <label>Location</label>
                    <input type="text" value={editServiceForm.location}
                      onChange={(e) => setEditServiceForm({ ...editServiceForm, location: e.target.value })} />
                    <div className="form-actions">
                      <button className="save-btn" onClick={() => saveEditService(s._id)} disabled={savingService}>
                        {savingService ? "Saving..." : "Save Changes"}
                      </button>
                      <button className="cancel-btn" onClick={() => setEditingServiceId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : confirmDeleteId === s._id ? (
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
                    <p style={{ flex: 1 }}>Delete <b>{s.title}</b>? This cannot be undone.</p>
                    <button className="delete-btn" onClick={() => deleteService(s._id)}>Yes, Delete</button>
                    <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.category} • ₹{s.price}</p>
                      <p className="booking-meta">{s.description}</p>
                      {s.location && <p className="booking-meta">📍 {s.location}</p>}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      
                      <button className="edit-btn" onClick={() => startEditService(s)}>✏️ Edit</button>
                      
                      <button className="delete-btn" onClick={() => setConfirmDeleteId(s._id)}>🗑 Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </section>

    
        <section className="provider-section">
          <h2>New Requests</h2>
          {pending.length === 0 ? (
            <p className="empty-text">No new requests</p>
          ) : (
            pending.map((b) => (
              <div key={b._id} className="provider-card">
                <div>
                  <h4>{b.service?.title}</h4>
                  <p>User: {b.user?.name}</p>
                  <p className="booking-meta">{b.date}{b.time && ` • ${b.time}`}</p>
                  {b.note && <p className="booking-note">Note: {b.note}</p>}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="accept-btn" onClick={() => updateStatus(b._id, "accepted")}>Accept</button>
                  {/* FIX 1 — reject button; backend Booking model already supports "rejected" status */}
                  <button className="delete-btn" onClick={() => updateStatus(b._id, "rejected")}>Reject</button>
                </div>
              </div>
            ))
          )}
        </section>

        
        <section className="provider-section">
          <h2>Active Jobs</h2>
          {accepted.length === 0 ? (
            <p className="empty-text">No active jobs</p>
          ) : (
            accepted.map((b) => (
              <div key={b._id} className="provider-card">
                <div>
                  <h4>{b.service?.title}</h4>
                  <p>User: {b.user?.name} • {b.user?.email}</p>
                  <p className="booking-meta">{b.date}{b.time && ` • ${b.time}`}</p>

                </div>
                <button className="complete-btn" onClick={() => updateStatus(b._id, "completed")}>Complete</button>
              </div>
            ))
          )}
        </section>

      
        <section className="provider-section">
          <h2>Completed Jobs</h2>
          {completed.length === 0 ? (
            <p className="empty-text">No completed jobs yet</p>
          ) : (
            completed.map((b) => (
              <div key={b._id} className="provider-card">
                <div>
                  <h4>{b.service?.title}</h4>
                  <p>User: {b.user?.name}</p>
                </div>
                <span className="done-badge">✓ Completed</span>
              </div>
            ))
          )}
        </section>

      </div>
    </div>
  );
};

export default ProviderDashboard;