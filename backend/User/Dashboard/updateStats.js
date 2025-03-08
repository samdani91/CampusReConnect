const db = require('../../db');
const {calculatePoints} = require('../../Gamification/calculatePoints');

async function updateStats(userId, hIndex, citationCount, callback) {
    if (!userId) {
        return callback({ status: 400, error: "User ID is required" }); 
    }

    try {
        const query = `
            UPDATE spl2.user 
            SET h_index = ?, citation_count = ? 
            WHERE user_id = ?
        `;

        const values = [hIndex, citationCount, userId];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error updating user stats:", err);
                return callback({ status: 500, error: "Internal server error" });
            }

            if (result.affectedRows === 0) {
                return callback({ status: 404, error: "User not found" });
            }

            calculatePoints(userId, (calcErr, points) => {
                if (calcErr) {
                    console.error("Error calculating points:", calcErr);
                    return callback({ status: 500, error: "Error updating points" });
                }

                callback(null, { message: "Statistics and points updated successfully", points });
            });
        });

    } catch (error) {
        console.error("Error updating user stats:", error);
        callback({ status: 500, error: "Internal server error" });
    }
}

module.exports = updateStats;