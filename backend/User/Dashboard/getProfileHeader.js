const db = require("../../db");

const getProfileHeader = (user_id, callback) => {
    const sql = `
        SELECT full_name, degree, department
        FROM user
        WHERE user_id = ?
    `;

    db.query(sql, [user_id.userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        if (results.length > 0) {
            return callback(null, results[0]);
        } else {
            return callback(null, null);
        }
    });
};

module.exports = getProfileHeader;