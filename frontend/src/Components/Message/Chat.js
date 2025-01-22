import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import UserList from "./UserList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";


function Chat() {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);


  // Fetch messages
  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`http://localhost:3001/messages/${null}/${selectedUser.id}`,{withCredentials:true})
        .then((res) => setMessages(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedUser]);

  // Real-time listener for receiving updated messages
  useEffect(() => {
    if(socket === null){
      const socket = io('ws://localhost:4000',{withCredentials: true});
      setSocket(socket);
    }
    socket?.on("receiveMessage", (updatedMessages) => {
      console.log(updatedMessages);
      setMessages(updatedMessages); // Update messages dynamically from the server
    });
  
      // socket?.on("Hello", () => {
      //   console.log("Socket says hello");
      // })
    
  }, [socket]);

  

  const sendMessage = (messageContent) => {
    if (!selectedUser) return alert("Select a user to chat with!");
    const newMessage = {
      message_id: Date.now(),
      message_content: messageContent,
      sender_id: null,
      receiver_id: selectedUser.id,
    };
    // console.log("Message being sent to backend:", newMessage);
  
    // Emit the message to the server
    socket?.emit("sendMessage", newMessage);
  
    // Optimistically update the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage, // No need to modify the message structure
    ]);
  };
  

  return (
    <div className="container-md mt-3">
      <div className="row" style={{ height: "calc(100vh - 100px)" }}>
        {/* User List */}
        <div className="col-md-4" style={{ height: "99%" }}>
          <UserList setSelectedUser={setSelectedUser} />
        </div>
        {/* Chat Box */}
        <div
          className="col-md-8 bg-white d-flex flex-column"
          style={{
            height: "99%",
            padding: "0",
            borderRadius: "5px",
          }}
        >
          {selectedUser ? (
            <>
              <div className="card h-100 w-100">
                <div
                  className="card-header d-flex align-items-center p-2 bg-primary text-white"
                  style={{ borderBottom: "1px solid #dee2e6", height: "70px" }}
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
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="mb-0">{selectedUser.name}</h5> {/* Full username */}
                    <small className="text-white">
                      {selectedUser.department}
                    </small>
                    {/* Department name as subheader */}
                  </div>
                </div>
                <MessageList messages={messages} userId={null} />
                <MessageInput onSend={sendMessage} />
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
              <h5>Select a user to start chatting!</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
