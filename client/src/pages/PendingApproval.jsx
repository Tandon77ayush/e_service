import "../styles/dashboard.css";

import { useAuth } from "../context/AuthContext";

const PendingApproval = () => {

  const { logout } = useAuth();

  return (

    <div className="dashboard pending-page">

      <div className="pending-card">

        <h1>
          Approval Pending
        </h1>

        <p>
          Your provider account is awaiting
          admin approval.
        </p>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>

  );
};

export default PendingApproval;