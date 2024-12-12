const db = require('./db');
const { isEmailExist, isStudentEmail, isFacultyEmail } = require('./checkExist');


function checkSignUp(name, email, department, role, password, res) {
    isEmailExist(email, (err, exists) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        if (exists) {
            return res.status(400).json({ message: 'User Already Exists !!!' });
        }

        if (role === 'Student' && !isStudentEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format. Use you university email.' });
        }

        if (role === 'Faculty' && !isFacultyEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.Use you university email.' });
        }

        const is_student = role === 'Student';

        // Query to get the current highest user_id
        const getMaxIdQuery = 'SELECT MAX(CAST(SUBSTRING(user_id, 2) AS UNSIGNED)) AS max_id FROM user';

        db.query(getMaxIdQuery, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: err.message });
            }

            // Generate the next user_id
            const maxId = results[0].max_id || 0; // If no user exists, max_id will be null
            const user_id = `U${maxId + 1}`;

            const sql = 'INSERT INTO user (user_id, is_student, email, full_name, department, passwords) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [user_id, is_student, email, name, department, password];

            db.query(sql, values, (err, data) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: err.message });
                }

                return res.status(200).json({ message: 'Registration Successful', data });
            });
        });
    });
}


module.exports = checkSignUp;