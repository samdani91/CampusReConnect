const db = require("../db");

const leaveCommunity = (userId, communityId, callback) => {
    const checkQuery = `SELECT * FROM user_community WHERE user_id = ? AND community_id = ?`;

    db.query(checkQuery, [userId, communityId], (err, results) => {
        if (err) {
            console.error("Error checking user membership:", err);
            return callback(err, null);
        }

        if (results.length === 0) {
            return callback(null, { success: false, message: "User is not a member of this community" });
        }

        const deleteQuery = `DELETE FROM user_community WHERE user_id = ? AND community_id = ?`;
        db.query(deleteQuery, [userId, communityId], (err, result) => {
            if (err) {
                console.error("Error leaving community:", err);
                return callback(err, null);
            }

            if (result.affectedRows === 1) {
                const deletePostsQuery = `DELETE FROM post WHERE user_id = ? AND community_id = ?`;
                db.query(deletePostsQuery, [userId, communityId], (err, deleteResult) => {
                    if (err) {
                        console.error("Error deleting posts:", err);
                        return callback(err, null);
                    }

                    if (deleteResult.affectedRows > 0) {
                        return callback(null, {
                            success: true,
                            message: `Left community and deleted ${deleteResult.affectedRows} posts successfully`
                        });
                    } else {
                        return callback(null, { success: true, message: "Left community successfully, but no posts were found to delete" });
                    }
                });
            } else {
                return callback(null, { success: false, message: "Failed to leave community" });
            }
        });
    });
};

module.exports = leaveCommunity;
