const db = require("../db"); // Ensure the correct path

const defineBadge = (userId, callback) => {
    const query = "SELECT points FROM spl2.user WHERE user_id = ?";

    db.query(query, [userId], (err, result) => {
        if (err) {
            // console.error("Database error:", err);
            return callback(err, null);
        }

        if (result.length === 0) {
            return callback(new Error("User not found"), null);
        }


        const points = parseInt(result[0].points, 10) || 0;
       
        let badge = "No Badge";
        if (points >= 1000) badge = "GoldBadge";
        else if (points >= 500) badge = "SilverBadge";
        else badge = "BronzeBadge";

        callback(null, badge);
    });
};

module.exports = { defineBadge };
