const db = require("../../db");

async function followUser(followeeId, followerId) {
    try {
        await db.promise().query('INSERT INTO follow (followee_id, follower_id) VALUES (?, ?)', [followeeId, followerId]);
        return { success: true, message: 'Followed successfully' };
    } catch (error) {
        console.error('Error following user:', error);
        return { success: false, message: 'Internal server error' };
    }
}
module.exports = followUser;