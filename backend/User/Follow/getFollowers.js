const db = require("../../db");

async function getFollowers(userId) {
    try {
        const [rows] = await db.promise().query(`SELECT user_id, full_name from user WHERE user_id in (select follower_id from follow where followee_id = ?)`, [userId]);
        return { success: true, data: rows };
    } catch (error) {
        console.error("Error fetching followers:", error);
        return { success: false, message: "Internal server error" };
    }
}

module.exports = getFollowers;