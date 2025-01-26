const db = require("../../db");

const updateProfileTab = (user_id, data, callback) => {
    const { introduction, disciplines, skillsExpertise, languages, twitter } = data;

    const sql = `
        UPDATE SPL2.User
        SET introduction = ?, disciplines = ?, skillsExpertise = ?, languages = ?, twitter = ?
        WHERE user_id = ?
    `;

    db.query(sql, [introduction, disciplines, skillsExpertise, languages, twitter, user_id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, result);
    });
};

module.exports = updateProfileTab;