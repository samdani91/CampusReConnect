const db = require("../../db");

const deleteAccountSettings = (user_id, password, callback) => {
    const sqlGetPassword = `SELECT passwords FROM user WHERE user_id = ?`;

    // Step 1: Verify the password
    db.query(sqlGetPassword, [user_id], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        if (results.length === 0) {
            return callback(null, { userNotFound: true });
        }

        const storedPassword = results[0].passwords;

        if (password !== storedPassword) {
            return callback(null, { incorrectPassword: true });
        }

        // Step 2: Delete the user account
        const sqlDeleteUser = `DELETE FROM user WHERE user_id = ?`;
        db.query(sqlDeleteUser, [user_id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, { success: true });
        });
    });
};

module.exports = deleteAccountSettings;