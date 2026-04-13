import { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  // Load users
  const loadUsers = () => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Add user
  const addUser = () => {
    if (!name || !email) return alert("Enter name and email");

    axios
      .post("http://localhost:5000/users", { name, email })
      .then(() => {
        loadUsers();
        setName("");
        setEmail("");
      });
  };

  // Delete user
  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:5000/users/${id}`)
      .then(() => loadUsers());
  };

  // Edit user
  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
  };

  // Update user
  const updateUser = () => {
    axios
      .put(`http://localhost:5000/users/${editId}`, {
        name,
        email,
      })
      .then(() => {
        loadUsers();
        setName("");
        setEmail("");
        setEditId(null);
      });
  };

  // Cancel edit
  const cancelEdit = () => {
    setName("");
    setEmail("");
    setEditId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User List</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={editId ? updateUser : addUser}
          style={{ marginLeft: "10px" }}
        >
          {editId ? "Update User" : "Add User"}
        </button>

        {editId && (
          <button
            onClick={cancelEdit}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            marginBottom: "5px",
          }}
        >
          {user.name} - {user.email}

          <button
            onClick={() => editUser(user)}
            style={{ marginLeft: "10px" }}
          >
            Edit
          </button>

          <button
            onClick={() => deleteUser(user.id)}
            style={{ marginLeft: "5px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Users;
