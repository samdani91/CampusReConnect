const db = require("../db");

async function getNotifications(userId) {
    try {
        const [results] = await db.promise().query(
            'SELECT * FROM notification WHERE receiver_id = ? ORDER BY notification_id DESC',
            [userId]
        );
        return { success: true, data: results };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return { success: false, message: 'Error fetching notifications' };
    }
}

module.exports = getNotifications;