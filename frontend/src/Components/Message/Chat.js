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
	const [selfUserId, setUserId] = useState(null);

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



	useEffect(() => {
		if (selectedUser) {
			axios
				.get(`http://localhost:3001/messages/${null}/${selectedUser.id}`, { withCredentials: true })
				.then((res) => setMessages(res.data))
				.catch((err) => console.error(err));
		}
	}, [selectedUser]);


	useEffect(() => {
		if (!socket) {
			const socket = io("ws://localhost:4000", { withCredentials: true });
			setSocket(socket);
		}
	
		socket?.on("receiveMessage", (newMessage) => { 
			if (selectedUser && (newMessage.sender_id === selectedUser.id )) {
				setMessages((prevMessages) => [...prevMessages, newMessage]);
			}
		});

		return () => {
			socket?.off("receiveMessage");
		};
	}, [socket, selectedUser]);
	



	const sendMessage = (messageContent) => {
		if (!selectedUser) return alert("Select a user to chat with!");
		const newMessage = {
			message_id: null,
			message_content: messageContent,
			sender_id: selfUserId,
			receiver_id: selectedUser.id,
			message_time: Date.now()
		};

		setMessages((prevMessages) => [
			...prevMessages,
			newMessage,
		]);
		socket?.emit("sendMessage", newMessage);

	};


	return (
		<>
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
										className="card-header d-flex align-items-center p-2  text-white"
										style={{ borderBottom: "1px solid #dee2e6", height: "70px" }}
									>
										<div
											className="rounded-circle bg-light text-black d-flex justify-content-center align-items-center"
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
											<h5 className="mb-0">{selectedUser.name}</h5>
											<small className="text-white">
												{selectedUser.department}
											</small>
										</div>
									</div>
									<MessageList messages={messages} />
									<MessageInput onSend={sendMessage} userId={selectedUser.id} />
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
		</>
	);
}

export default Chat;