const db = require('../db');

function checkLogin(email, password, callback) {
    const sql = 'SELECT * FROM user WHERE email = ? AND passwords = ?';

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return callback(err, null);
        }

        if (results.length > 0) {
            const user = results[0]; // Get user details from the result
            callback(null, true, user); // Pass user details to the callback
        } else {
            callback(null, false, null); // No user found
        }
    });
}

module.exports = checkLogin;