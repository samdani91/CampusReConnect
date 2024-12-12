const db = require("./db");

function checkLogin(email, password, callback) {
    // SQL query to check if email and password exist in the database
    const sql = 'SELECT * FROM user WHERE email = ? AND passwords = ?';

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return callback(err, null);
        }

        if (results.length > 0) {
            // If credentials match
            callback(null, true);
        } else {
            // If no match is found
            callback(null, false);
        }
    });
}

module.exports= checkLogin;