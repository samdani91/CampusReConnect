const db = require("../../db");
const bcrypt = require('bcrypt');

const changePasswordSettings = async(user_id, passwords, callback) => {
    const hashedPassword = await bcrypt.hash(passwords, 10);
    const sql = `UPDATE user SET passwords = ? WHERE user_id = ?`;
    db.query(sql, [hashedPassword, user_id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, result);
    });
};

module.exports = changePasswordSettings;