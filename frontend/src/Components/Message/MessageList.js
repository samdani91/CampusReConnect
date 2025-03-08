import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function MessageList({ messages }) {
	const [userId, setUserId] = useState(null);
	const messageEndRef = useRef(null);

	useEffect(() => {
		axios
			.get("http://localhost:3001/get-userId", { withCredentials: true })
			.then((response) => {
				setUserId(response.data.user_id);
			})
			.catch((err) => {
				console.error("Failed to fetch user ID:", err);
			});
	}, []);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const formatTimestamp = (timestamp) => {
		const date = new Date(parseInt(timestamp));
		const options = { year: "numeric", month: "short", day: "numeric" };
		const formattedDate = date.toLocaleDateString("en-US", options);
		const hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${formattedDate} - ${hours}:${minutes}`;
	};

	return (
		<div
			className="flex-grow-1 overflow-auto p-3"
			style={{ backgroundColor: "#f9f9f9" }}
		>
			{messages.map((msg) => (
				<div
					key={msg.message_id}
					className={`d-flex mb-3 ${msg.sender_id === userId ? "justify-content-end" : "justify-content-start"
						}`}
				>
					<div
						className={`p-2 rounded shadow-sm`}
						style={{
							maxWidth: "75%",
							backgroundColor: msg.sender_id !== userId ? "#deeaee" : "#e1e7f7",
							color: "black",
							whiteSpace: 'pre-line'
						}}
					>
						{msg.message_content}
						<div className="text-muted" style={{ fontSize: "0.8rem" }}>
							{formatTimestamp(msg.message_time)}
						</div>
					</div>
				</div>
			))}
			<div ref={messageEndRef} />
		</div>
	);
}

export default MessageList;
