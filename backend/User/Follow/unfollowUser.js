const db = require("../../db");

async function unfollowUser(followeeId, followerId) {
    try {
        const result = await db.promise().query('DELETE FROM follow WHERE followee_id = ? AND follower_id = ?', [followeeId, followerId]);
        if (result[0].affectedRows > 0) {
            return { success: true, message: 'Unfollowed successfully' };
        } else {
            return { success: false, message: 'Follow relationship not found' };
        }
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return { success: false, message: 'Internal server error' };
    }
}

module.exports = unfollowUser;