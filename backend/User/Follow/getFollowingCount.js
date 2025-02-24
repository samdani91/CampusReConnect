const db = require("../../db");

async function getFollowingCount(userId) {
    try {
        const [rows] = await db.promise().query('SELECT COUNT(*) as count FROM follow WHERE follower_id = ?', [userId]);
        return { count: rows[0].count };
    } catch (error) {
        console.error('Error getting following count:', error);
        return { success: false, message: 'Internal server error' };
    }
}

module.exports = getFollowingCount;