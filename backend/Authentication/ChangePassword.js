const db = require('../db');
const bcrypt = require('bcrypt');
const { isEmailExist, isStudentEmail, isFacultyEmail } = require('./checkExist');

function ChangePassword(email, newPassword, res) {
    isEmailExist(email, async(err, exists) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (!exists) {
            return res.status(400).json({ message: 'User does not exist!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = "UPDATE user SET passwords = ? WHERE email = ?";
        const values = [hashedPassword, email];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ message: 'Error updating password' });
            }

            if (result.affectedRows > 0) {
                return res.status(200).json({ message: 'Password updated' });
            } else {
                return res.status(400).json({ message: 'Failed to update password!' });
            }
        });
    });
}

module.exports = ChangePassword;