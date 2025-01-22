import React, { useEffect,useRef,useState } from "react";
import axios from "axios";

function MessageList({ messages}) {
  // let userId="U3"
  const [userId, setUserId] = useState(null);
  const messageEndRef = useRef(null);
  // console.log(messages);
  // console.log(userId);
  useEffect(() => {
    axios
      .get("http://localhost:3001/get-userId", { withCredentials: true })
      .then((response) => {
        setUserId(response.data.user_id);
        // console.log(response.data) // Assuming the backend returns { user_id: "U3" }
      })
      .catch((err) => {
        console.error("Failed to fetch user ID:", err);
      });
  }, []);
  
  // Scroll to the bottom of the chatbox whenever messages are updated
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
          <div
            className={`p-2 rounded shadow-sm ${
              msg.sender_id === userId ? "bg-primary text-white" : "bg-light text-dark"
            }`}
            style={{ maxWidth: "75%" }}
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
