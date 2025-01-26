const db = require("../../db");

const changePasswordSettings = (user_id, passwords, callback) => {
    const sql = `UPDATE user SET passwords = ? WHERE user_id = ?`;
    db.query(sql, [passwords, user_id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, result);
    });
};

module.exports = changePasswordSettings;