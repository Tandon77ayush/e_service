import { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/users",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers(res.data);
  };

  const toggleBlock = async (id) => {
    await axios.put(
      `http://localhost:5000/api/admin/users/block/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchUsers();
  };

  return (
    <div>
      <h1>Users</h1>

      {users.map((u) => (
        <div key={u._id} style={{ padding: 10, background: "#fff", margin: 10 }}>
          <p>{u.name}</p>
          <p>{u.email}</p>
          <p>{u.role}</p>

          <button onClick={() => toggleBlock(u._id)}>
            {u.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;