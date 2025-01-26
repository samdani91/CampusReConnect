const db = require("../../db");

const updateProfileSettings = (user_id, field, value, allowedFields, callback) => {
    if (!allowedFields.includes(field)) {
        return callback(null, { invalidField: true });
    }

    const sql = `UPDATE user SET ${field} = ? WHERE user_id = ?`;
    db.query(sql, [value, user_id], (err, result) => {
        if (err) {
            return callback(err, null);
        }

        if (result.affectedRows > 0) {
            return callback(null, { success: true, field });
        } else {
            return callback(null, { userNotFound: true });
        }
    });
};

module.exports = updateProfileSettings;