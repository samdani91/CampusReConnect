const db = require("../../db");

async function getFollowersCount(userId) {
    try {
        const [rows] = await db.promise().query('SELECT COUNT(*) as count FROM follow WHERE followee_id = ?', [userId]);
        return { count: rows[0].count };
    } catch (error) {
        console.error('Error getting followers count:', error);
        return { success: false, message: 'Internal server error' };
    }
}

module.exports = getFollowersCount;