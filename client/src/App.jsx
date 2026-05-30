import { useState } from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PendingApproval from "./pages/PendingApproval";
import MyBookings from "./pages/MyBookings";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  const [page, setPage] = useState("dashboard"); // dashboard | bookings
  const [publicPage, setPublicPage] = useState("home"); // home | about | contact

  if (loading) return <h1>Loading...</h1>;

  
  if (!user) {
    if (publicPage === "about") return <About setPage={setPublicPage} />;
    if (publicPage === "contact") return <Contact setPage={setPublicPage} />;
    return <Home setPage={setPublicPage} />;
  }

  if (user.role === "user") {
    if (page === "bookings") {
      return (
        <MyBookings
          setPage={setPage}
        />
      );
    }

    return (
      <UserDashboard
        goToBookings={() => setPage("bookings")}
      />
    );
  }

  
  if (user.role === "provider" && !user.isApproved) {
    return <PendingApproval />;
  }

 
  if (user.role === "provider" && user.isApproved) {
    return <ProviderDashboard />;
  }

 
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return <Home setPage={setPublicPage} />;
}

export default App;