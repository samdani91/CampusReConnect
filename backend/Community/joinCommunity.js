const db = require("../db");

const joinCommunity = (userId, communityId, callback) => {
    const checkQuery = `SELECT * FROM user_community WHERE user_id = ? AND community_id = ?`;

    db.query(checkQuery, [userId, communityId], (err, results) => {
        if (err) {
            console.error("Error checking user community membership:", err);
            return callback(err, null);
        }

        if (results.length > 0) {
            return callback(null, { success: false, message: "User is already a member of this community" });
        }

        // Insert user into community
        const insertQuery = `INSERT INTO user_community (user_id, community_id) VALUES (?, ?)`;
        db.query(insertQuery, [userId, communityId], (err, result) => {
            if (err) {
                console.error("Error joining community:", err);
                return callback(err, null);
            }

            if (result.affectedRows === 1) {
                return callback(null, { success: true, message: "Joined community successfully" });
            } else {
                return callback(null, { success: false, message: "Failed to join community" });
            }
        });
    });
};

module.exports = joinCommunity;
