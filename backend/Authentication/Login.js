const bcrypt = require('bcrypt');
const db = require('../db');

function Login(email, password, callback) {
    const sql = 'SELECT * FROM user WHERE email = ?';

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return callback(err, null);
        }

        if (results.length > 0) {
            const user = results[0];

            bcrypt.compare(password, user.passwords, (compareErr, isMatch) => {
                if (compareErr) {
                    console.error('Error comparing password:', compareErr);
                    return callback(compareErr, null);
                }

                if (isMatch) {
                    callback(null, true, user);
                } else {
                    callback(null, false, null);
                }
            });
        } else {
            callback(null, false, null);
        }
    });
}

module.exports = Login;