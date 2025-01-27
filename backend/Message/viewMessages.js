const db = require('../db');

function viewMessages(user_id, receiverId, callback){
    const query = `
        SELECT * FROM message 
        WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
        ORDER BY message_time ASC
    `;

    db.query(query, [user_id, receiverId, receiverId, user_id], (err, results) => {
        if (err) {
            console.error("Error fetching messages:", err);
            return callback(err, null);
        }
        callback(null, results);
    });
}

module.exports = viewMessages;