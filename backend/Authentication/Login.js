const db = require('../db');

function Login(email, password, callback) {
    const sql = 'SELECT * FROM user WHERE email = ? AND passwords = ?';

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return callback(err, null);
        }

        if (results.length > 0) {
            const user = results[0]; 
            callback(null, true, user);
        } else {
            callback(null, false, null);
        }
    });
}

module.exports = Login;