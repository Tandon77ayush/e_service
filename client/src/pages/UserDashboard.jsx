import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/userDashboard.css";

const categories = [
  { name: "Plumbing", icon: "🔧" },
  { name: "AC Repair", icon: "❄️" },
  { name: "Cleaning", icon: "🧹" },
  { name: "Painting", icon: "🖌️" },
  { name: "Electrical", icon: "⚡" },
  { name: "Other", icon: "🛠️" },
];

const UserDashboard = ({ goToBookings }) => {
  const { user, logout } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [citySearch, setCitySearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (selectedCategory) {
      loadServices(selectedCategory, citySearch);
    }
  }, [selectedCategory]);

  const loadServices = async (category, city) => {
    try {
      const params = {};
      if (category) params.category = category;
      if (city) params.city = city;

      const res = await axios.get("http://localhost:5000/api/services", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setServices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = () => {
    if (!selectedCategory) return;
    loadServices(selectedCategory, citySearch);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat.name);
    setCitySearch("");
    setServices([]);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setServices([]);
    setCitySearch("");
  };

  const bookService = async (serviceId) => {
    try {
      // step 1 — create razorpay order
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { serviceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount, currency } = orderRes.data;

      // step 2 — open razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id: orderId,
        name: "NeighborHand",
        description: "Service Booking Payment",
        handler: async (response) => {
          // step 3 — verify payment and create booking
          await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              serviceId,
              date: new Date().toISOString().split("T")[0],
              time: "10:00 AM",
              note: "Booked from UI",
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          alert("Booking confirmed!");
        },
        prefill: {
          name: user?.name,
        },
        theme: {
          color: "#2f66ff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="user-dashboard">

      <nav className="user-navbar">
        <h2>Welcome, {user?.name} </h2>

        <div className="nav-actions">
          <button className="mybookings-btn" onClick={goToBookings}>
            My Bookings
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="user-content">

        {/* CATEGORY VIEW */}
        {!selectedCategory && (
          <>
            <h2 className="section-title">What do you need help with?</h2>
            <p className="section-subtitle">Choose a category to browse available services in your area</p>

            <div className="category-grid">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="category-card"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className="category-icon">{cat.icon}</div>
                  <p className="category-name">{cat.name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SERVICES VIEW */}
        {selectedCategory && (
          <>
            <div className="services-header">
              <div className="services-header-left">
                <button className="back-btn" onClick={handleBack}>
                  ← Back
                </button>
                <h2 className="section-title">{selectedCategory} Services</h2>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by city..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="city-input"
                />
                <button className="search-btn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>

            {/* SERVICES */}
            <div className="service-grid">
              {services.length === 0 ? (
                <p className="empty-text">No services found</p>
              ) : (
                services.map((s) => (
                  <div key={s._id} className="service-card">

                    <div className="service-top">
                      <div className="service-icon">🔧</div>

                      <div>
                        <h3 className="service-title">{s.title}</h3>
                        <p className="service-provider">by {s.provider?.name}</p>
                      </div>
                    </div>

                    <p className="service-desc">{s.description}</p>

                    <div className="provider-details">
                      <p className="provider-detail-item">
                        <span className="provider-detail-icon">👤</span>
                        <span>{s.provider?.name}</span>
                      </p>
                      {s.location && (
                        <p className="provider-detail-item">
                          <span className="provider-detail-icon">📍</span>
                          <span>{s.location}</span>
                        </p>
                      )}
                      {s.provider?.email && (
                        <p className="provider-detail-item">
                          <span className="provider-detail-icon">✉️</span>
                          <span>{s.provider.email}</span>
                        </p>
                      )}
                    </div>

                    <div className="service-bottom">
                      <span className="service-price">₹{s.price}</span>

                      <button
                        className="book-btn"
                        onClick={() => bookService(s._id)}
                      >
                        Book Now
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;