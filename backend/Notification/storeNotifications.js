const db = require("../db");

async function storeNotifications(id, senderId, receiverId, content) {
    try {
        await db.promise().query(
            'INSERT INTO notification (notification_id,sender_id, receiver_id, notification_content) VALUES (?, ?, ?, ?)',
            [id, senderId, receiverId, content]
        );
        return { success: true, message: 'Notification stored successfully' };
    } catch (error) {
        console.error('Error storing notification:', error);
        return { success: false, message: 'Error storing notification' };
    }
}

module.exports = storeNotifications;