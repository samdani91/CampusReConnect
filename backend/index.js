const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const checkSignUp = require('./Authentication/checkSignUp');
const checkLogin = require('./Authentication/checkLogin');
const { sendCode, verificationCodes } = require('./Authentication/sendCode');
const passwordReset = require('./Authentication/passwordReset');
const db = require('./db'); // Assuming your database connection file is named db.js

const SECRET_KEY = 'authTokenKey';
const PORT = 3001;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // Allow credentials for cookies
app.use(express.json());
app.use(cookieParser());

// Middleware to authenticate and extract user_id from the token
function authenticateToken(req, res, next) {
    const token = req.cookies.authToken; // Retrieve the token from cookies

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verify token
        req.user_id = decoded.user_id; // Attach user_id to the request object
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

app.get('/check-auth', authenticateToken, (req, res) => {
    return res.status(200).json({ isAuthenticated: true });
});

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { name, email, department, role, password } = req.body;

    try {
        // Call the checkSignUp function and handle the response
        await checkSignUp(name, email, department, role, password, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    checkLogin(email, password, (err, isValid, user) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (isValid) {
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email },
                SECRET_KEY,
                { expiresIn: '24h' }
            );

            // Set the token as an HTTP-only cookie
            res.cookie('authToken', token, { httpOnly: true, secure: false }); // Use `secure: true` for HTTPS
            return res.status(200).json({ message: 'Login Successful' });
        } else {
            return res.status(401).json({ message: 'Credentials Mismatch' });
        }
    });
});

// Forgot Password Endpoint
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        await sendCode(email, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Verify Code Endpoint
app.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required' });
    }

    try {
        if (!verificationCodes.has(email)) {
            return res.status(400).json({ message: 'Verification code not found or expired' });
        }

        const storedCode = verificationCodes.get(email).code;

        if (storedCode === code) {
            verificationCodes.delete(email);
            return res.status(200).json({ message: 'Code verified' });
        } else {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
    } catch (err) {
        console.error('Error verifying code:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Reset Password Endpoint
app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        await passwordReset(email, newPassword, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Update User Endpoint
app.put('/update-user-details', authenticateToken, (req, res) => {
    const user_id = req.user_id; // Extracted from token
    var { field, value } = req.body;

    const allowedFields = ['full_name', 'degree', 'department'];
    if (!allowedFields.includes(field)) {
        return res.status(400).json({ message: 'Invalid field for update' });
    }

    const sql = `UPDATE user SET ${field} = ? WHERE user_id = ?`;
    db.query(sql, [value, user_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error updating user details' });
        }

        if (result.affectedRows > 0) {
            if(field === "full_name") field="Name";
            return res.status(200).json({ message: `${field} updated successfully` });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});

app.put('/change-password', authenticateToken, (req, res) => {
    const user_id = req.user_id; // Extracted from token
    const { passwords } = req.body;

    const sql = `UPDATE user SET passwords = ? WHERE user_id = ?`;
    db.query(sql, [passwords, user_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error updating user details' });
        }

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Password updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});

app.delete('/delete-account', authenticateToken, (req, res) => {
    const user_id = req.user_id; // Extracted from token
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    // Retrieve the user's current password from the database
    const sqlGetPassword = 'SELECT passwords FROM user WHERE user_id = ?';
    db.query(sqlGetPassword, [user_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error retrieving user data' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const storedPassword = results[0].passwords;

        // Compare the given password with the stored password
        if (password !== storedPassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Delete the user from the database
        const sqlDeleteUser = 'DELETE FROM user WHERE user_id = ?';
        db.query(sqlDeleteUser, [user_id], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Error deleting user account' });
            }
            res.clearCookie('authToken', { httpOnly: true, secure: false });
            return res.status(200).json({ message: 'Account deleted successfully' });
        });
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('authToken', { httpOnly: true, secure: false }); // Clear the authToken cookie
    return res.status(200).json({ message: 'Logged out successfully' });
});

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Backend Server Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
