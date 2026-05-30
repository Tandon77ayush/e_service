import "../styles/adminlayout.css";
import { NavLink } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-container">

     
      <div className="sidebar">
        <h2>Serveasy Admin</h2>

        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/services">Services</NavLink>
        <NavLink to="/admin/bookings">Bookings</NavLink>
      </div>

      
      <div className="main">
        {children}
      </div>

    </div>
  );
};

export default AdminLayout;