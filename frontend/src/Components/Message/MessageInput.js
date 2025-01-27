import React, { useState, useEffect } from "react";
import axios from "axios";

function MessageInput({ onSend, userId }) {
	const [isActive, setIsActive] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchUserStatus = async () => {
			try {
				const response = await axios.get(`http://localhost:3001/user-status/${userId}`, { withCredentials: true });
				setIsActive(response.data.isActive);
			} catch (error) {
				console.error("Error fetching user status:", error);
			}
		};
		fetchUserStatus();
		const interval = setInterval(fetchUserStatus, 1000);

		return () => clearInterval(interval);
	}, [userId]);

	const handleSend = () => {
		if (message.trim()) {
			onSend(message);
			setMessage("");
		}
	};

	return (
		<div className="input-group p-2 bg-light">
			{isActive ? (
				<>
					<input
						type="text"
						className="form-control border-2 rounded-pill me-2"
						placeholder="Type a message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						style={{ padding: "10px 20px" }}
					/>
					<button
						className="btn bx bxs-send"
						onClick={handleSend}
						style={{
							backgroundColor: "#007bff",
							borderRadius: "50px",
							padding: "10px 15px",
							border: "none",
							cursor: "pointer",
							color: "white",
							fontSize: "1.2em",
							transition: "background-color 0.3s ease",
						}}
						onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
						onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
					></button>
				</>
			) : (
				<div
					className="text-center w-100 bg-danger rounded-pill"
					style={{
						padding: "10px 0",
						color: "white",
						fontSize: "1rem",
					}}
				>
					This user is not available<br/>
					You can't reply to the conversation
				</div>
			)}
		</div>
	);
}

export default MessageInput;
