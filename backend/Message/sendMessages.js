const db = require('../db');
const { v4: uuidv4 } = require('uuid');
function sendMessages(data, senderId, socket, io, userSockets) {
    const { message_content, receiver_id, message_time } = data;

    const message_id = uuidv4();

    const query = `
        INSERT INTO message (message_id, message_content, sender_id, receiver_id, message_time) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [message_id, message_content, senderId, receiver_id, message_time], (err) => {
        if (err) {
            console.error("Error saving message:", err);
            return;
        }

        console.log("Message saved:", message_id);

        const fetchQuery = `
            SELECT * FROM message WHERE message_id = ?
        `;

        db.query(fetchQuery, [message_id], (err, newMessage) => {  
            if (err) {
                console.error("Error fetching new message:", err);
                return;
            }

            if (newMessage.length === 0) {
                console.error("New message not found after insertion!");
                return;
            }

            const messageToSend = newMessage[0];

            socket.emit("receiveMessage", messageToSend);
            const receiverSocketId = userSockets.get(receiver_id);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", messageToSend);
            }
        });
    });
}

module.exports = sendMessages;