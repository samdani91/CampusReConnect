const db = require("../../db");

async function isFollowingUser(followeeId, followerId) {
    try {
        const [rows] = await db.promise().query('SELECT * FROM follow WHERE followee_id = ? AND follower_id = ?', [followeeId, followerId]);
        return { isFollowing: rows.length > 0 };
    } catch (error) {
        console.error('Error checking follow status:', error);
        return { success: false, message: 'Internal server error' };
    }
}

module.exports = isFollowingUser;