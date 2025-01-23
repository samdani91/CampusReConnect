import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function MessageList({ messages }) {
  const [userId, setUserId] = useState(null); // Current user's ID
  const messageEndRef = useRef(null);

  // Fetch current user ID from the backend
  useEffect(() => {
    axios
      .get("http://localhost:3001/get-userId", { withCredentials: true })
      .then((response) => {
        setUserId(response.data.user_id); // Assuming backend returns { user_id: "U3" }
      })
      .catch((err) => {
        console.error("Failed to fetch user ID:", err);
      });
  }, []);

  // Scroll to the bottom of the chatbox whenever messages are updated
  useEffect(() => {
    // messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex-grow-1 overflow-auto p-3"
      style={{ backgroundColor: "#f9f9f9" }}
    >
      {messages.map((msg) => (
        <div
          key={msg.message_id}
          className={`d-flex mb-3 ${
            msg.sender_id === userId ? "justify-content-end" : "justify-content-start"
          }`}
        >
          {/* Name Avatar */}
          {/* {msg.sender_id !== userId && (
            <div
              className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
              style={{
                width: "30px",
                height: "30px",
                fontSize: "1em",
              }}
            >
              {msg.sender_name?.charAt(0).toUpperCase()}
            </div>
          )} */}
          <div
            className={`p-2 rounded shadow-sm`}
            style={{
              maxWidth: "75%",
              backgroundColor: msg.sender_id !== userId ? "#deeaee" : "#e1e7f7", // Custom background color
              color: "black", // Ensure dark text on light background
            }}
          >
            {msg.message_content}
          </div>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
}

export default MessageList;
