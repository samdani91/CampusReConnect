const db = require("../db");

const calculatePoints = (userId, callback) => {
    const query = `
        SELECT u.h_index, u.citation_count, 
               COALESCE(SUM(p.upvotes), 0) AS post_upvotes, COALESCE(SUM(p.downvotes), 0) AS post_downvotes,
               COALESCE(SUM(c.upvotes), 0) AS comment_upvotes, COALESCE(SUM(c.downvotes), 0) AS comment_downvotes
        FROM spl2.user u
        LEFT JOIN spl2.post p ON u.user_id = p.user_id
        LEFT JOIN spl2.comment c ON u.user_id = c.user_id
        WHERE u.user_id = ?
        GROUP BY u.user_id;
    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            return callback(err, null);
        }

        if (result.length === 0) {
            return callback(new Error("User not found"), null);
        }

        const hIndex = result[0].h_index || 0;
        const citationCount = result[0].citation_count || 0;
        const totalUpvotes = (result[0].post_upvotes || 0) + (result[0].comment_upvotes || 0);
        const totalDownvotes = (result[0].post_downvotes || 0) + (result[0].comment_downvotes || 0);

        // Calculate points
        const points = (10 * hIndex) + (1 * citationCount) + (20 * (totalUpvotes - totalDownvotes));

        // Update the points column in the database
        const updateQuery = "UPDATE spl2.user SET points = ? WHERE user_id = ?";
        db.query(updateQuery, [points, userId], (updateErr) => {
            if (updateErr) {
                return callback(updateErr, null);
            }

            callback(null, points);
        });
    });
};

module.exports = { calculatePoints };
