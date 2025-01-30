import React, { useState, useEffect } from "react";
import axios from "axios";
import './userList.css'

function UserList({ setSelectedUser }) {
  const [selfUserId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/user-list", {
        withCredentials: true,
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, [users]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/get-userId", { withCredentials: true })
      .then((response) => {
        setUserId(response.data.user_id);
      })
      .catch((err) => {
        console.error("Failed to fetch user ID:", err);
      });
  }, [selfUserId]);

  const handleUserClick = (user) => {
    setSelectedUser(user); // Pass the selected user to the parent component
    setActiveUserId(user.id); // Update the local state to track the active user
  };

  return (
    <div className="card h-100" style={{
      width:"100%"
    }}>
      <div className="card-header bg-primary text-white d-flex align-items-center justify-content-center" style={{height:"72px"}}>
        <strong>Chat List</strong>
      </div>
      <ul className="list-group list-group-flush overflow-auto h-100 userList">
        {users
        .filter((user) => user.id !== selfUserId)
        .map((user) => (
          <li
            key={user.id}
            className={`list-group-item d-flex align-items-center ${
              activeUserId === user.id ? "active" : ""
            }`}
            onClick={() => handleUserClick(user)}
            style={{ cursor: "pointer",transition: "background-color 0.1s linear" }}
          >
            <div
              className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
              style={{
                width: "40px",
                height: "40px",
                fontSize: "18px",
                marginRight: "10px",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="mb-0">{user.name}</p>
              <small>
                      {user.department}
                    </small>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
