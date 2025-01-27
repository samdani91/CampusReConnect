const db = require('../db');
const { v4: uuidv4 } = require('uuid');

function sendMessages(data, senderId, socket, io, userSockets) {
    const { msg_id, message_content, receiver_id, message_time } = data;

    const message_id = uuidv4();

    const query = `
        INSERT INTO message (message_id, message_content, sender_id, receiver_id,message_time) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [message_id, message_content, senderId, receiver_id,message_time], (err) => {
        if (err) {
            console.error("Error saving message:", err);
            return;
        }

        console.log("Message saved:", message_id);

        const fetchQuery = `
            SELECT * FROM message 
            WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY message_time ASC
        `;
        db.query(fetchQuery, [senderId, receiver_id, receiver_id, senderId], (err, updatedMessages) => {
            if (err) {
                console.error("Error fetching updated messages:", err);
                return;
            }

            // Emit the updated messages
            socket.emit("receiveMessage", updatedMessages); // Emit to sender
            const receiverSocketId = userSockets.get(receiver_id);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", updatedMessages); // Emit to receiver
            }
        });
    });
}

module.exports = sendMessages;