const db = require("../../db");

const deleteAccountSettings = (user_id, password, callback) => {
    const sqlGetPassword = `SELECT passwords FROM user WHERE user_id = ?`;

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

        const sqlDeactivateUser = `
            UPDATE user 
            SET 
                status = 'inactive',
                email = NULL,
                full_name= 'CampusReConnect User',
                department = NULL,
                passwords = NULL,
                research_interest = NULL,
                achievements = NULL,
                citation_count = NULL,
                h_index = NULL,
                points = NULL,
                badges = NULL,
                degree = NULL,
                introduction = NULL,
                disciplines = NULL,
                skillsExpertise = NULL,
                languages = NULL,
                twitter = NULL
            WHERE user_id = ?;
        `;

        db.query(sqlDeactivateUser, [user_id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, { success: true });
        });

    });
};

module.exports = deleteAccountSettings;