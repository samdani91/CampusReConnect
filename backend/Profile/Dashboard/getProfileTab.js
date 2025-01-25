const db = require("../../db");

const getProfileTab = (user_id, callback) => {
    const sql = `
        SELECT email, introduction, disciplines, skillsExpertise, languages, twitter
        FROM SPL2.User
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
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

module.exports = getProfileTab;