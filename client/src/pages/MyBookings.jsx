import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/myBookings.css";


const MyBookings = ({ setPage }) => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bookings/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mybookings-page">


      {/* NAVBAR */}
      <nav className="mybookings-navbar">
        <div className="navbar-left">
          <h2>My Bookings</h2>
          <button className="services-btn" onClick={() => setPage("dashboard")}>
            ← Services
          </button>
        </div>

        <div>
          <span className="user-name">Hi, {user?.name}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="mybookings-content">

        {bookings.length === 0 ? (
          <p className="empty-text">No bookings found</p>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="booking-card">

              <div className="booking-left">
                <h3>{b.service?.title}</h3>
                <p>Provider: {b.provider?.name}</p>
                <p>Date: {b.date || "Not set"}</p>
                <p>Time: {b.time || "Not set"}</p>
              </div>

              <div className="booking-right">
                <span className={`status ${b.status}`}>
                  {b.status}
                </span>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default MyBookings;