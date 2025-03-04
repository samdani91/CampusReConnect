const db = require("../db");

const leaveCommunity = (userId, communityId, callback) => {
    // Check if the user is a member of the community
    const checkQuery = `SELECT * FROM user_community WHERE user_id = ? AND community_id = ?`;

    db.query(checkQuery, [userId, communityId], (err, results) => {
        if (err) {
            console.error("Error checking user membership:", err);
            return callback(err, null);
        }

        if (results.length === 0) {
            return callback(null, { success: false, message: "User is not a member of this community" });
        }

        // Delete the user from the community
        const deleteQuery = `DELETE FROM user_community WHERE user_id = ? AND community_id = ?`;
        db.query(deleteQuery, [userId, communityId], (err, result) => {
            if (err) {
                console.error("Error leaving community:", err);
                return callback(err, null);
            }

            if (result.affectedRows === 1) {
                return callback(null, { success: true, message: "Left community successfully" });
            } else {
                return callback(null, { success: false, message: "Failed to leave community" });
            }
        });
    });
};

module.exports = leaveCommunity;
