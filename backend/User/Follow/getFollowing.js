const db = require("../../db");

async function getFollowing(userId) {
    try {
        const [rows] = await db.promise().query(`SELECT user_id, full_name from user WHERE user_id in (select followee_id from follow where follower_id = ?)`, [userId]);
        return { success: true, data: rows };
    } catch (error) {
        console.error("Error fetching following:", error);
        return { success: false, message: "Internal server error" };
    }
}

module.exports = getFollowing;