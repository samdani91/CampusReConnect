const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const checkSignUp = require('./Authentication/checkSignUp');
const checkLogin = require('./Authentication/checkLogin');
const { getProfileTab, updateProfileTab} = require("./Profile/Dashboard")
const { getProfileSettings, changePasswordSettings,deleteAccountSettings} = require("./Profile/Settings");
const { sendCode, verificationCodes } = require('./Authentication/sendCode');
const passwordReset = require('./Authentication/passwordReset');
const db = require('./db');
const { Server } = require('socket.io');

const SECRET_KEY = 'authTokenKey';
const PORT = 3001;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // Allow credentials for cookies
app.use(express.json());
app.use(cookieParser());

const io = new Server(4000, { cors: { credentials: true, origin: 'http://localhost:3000' } });

function authenticateToken(req, res, next) {
    const token = req.cookies.authToken; 

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user_id = decoded.user_id;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

io.use((socket, next) => {
    const token = socket.handshake.headers['cookie']
        ?.split(';')
        .find((c) => c.trim().startsWith('authToken='))
        ?.split('=')[1];

    if (!token) {
        return next(new Error('Authentication token is missing'));
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        socket.user_id = decoded.user_id;
        next();
    } catch (err) {
        return next(new Error('Invalid or expired token'));
    }
});

app.get('/check-auth', authenticateToken, (req, res) => {
    return res.status(200).json({ isAuthenticated: true });
});

app.get('/get-userId', authenticateToken, (req, res) => {
    return res.status(200).json({ user_id: req.user_id });
});


app.post('/register', async (req, res) => {
    const { name, email, department, role, password } = req.body;

    try {
        await checkSignUp(name, email, department, role, password, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


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


            res.cookie('authToken', token, { httpOnly: true, secure: false }); // Use `secure: true` for HTTPS
            return res.status(200).json({ message: 'Login Successful' });
        } else {
            return res.status(401).json({ message: 'Credentials Mismatch' });
        }
    });
});


app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        await sendCode(email, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


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


app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        await passwordReset(email, newPassword, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


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
            if (field === "full_name") field = "Name";
            return res.status(200).json({ message: `${field} updated successfully` });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});

app.put('/change-password', authenticateToken, (req, res) => {
    const user_id = req.user_id;
    const { passwords } = req.body;

    changePasswordSettings(user_id, passwords, (err, result) => {
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
    const user_id = req.user_id;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    deleteAccountSettings(user_id, password, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error deleting user account' });
        }

        if (result.userNotFound) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (result.incorrectPassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.clearCookie('authToken', { httpOnly: true, secure: false });
        return res.status(200).json({ message: 'Account deleted successfully' });
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('authToken', { httpOnly: true, secure: false });
    return res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/user-list', authenticateToken, (req, res) => {
    const sql = `
        SELECT 
            user_id AS id, 
            full_name AS name, 
            department,
            'https://example.com/default-avatar.jpg' AS avatar -- Replace with your actual avatar logic
        FROM SPL2.User
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching user list:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        return res.status(200).json(results);
    });
});

app.get('/get-profile', authenticateToken, (req, res) => {
    const user_id = req.user_id;

    getProfileSettings(user_id, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error fetching profile data' });
        }

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});

app.get('/get-profileTab', authenticateToken, (req, res) => {
    const user_id = req.user_id;

    getProfileTab(user_id, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error fetching profile data" });
        }

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    });
});

app.put("/update-profileTab", authenticateToken, (req, res) => {
    const user_id = req.user_id;
    const data = req.body;

    updateProfileTab(user_id, data, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error updating profile data" });
        }
        return res.status(200).json({ message: "Profile updated successfully" });
    });
});

const userSockets = new Map();

app.get("/messages/:userId/:receiverId", authenticateToken, async (req, res) => {
    const { userId, receiverId } = req.params;
    const user_id = req.user_id;

    // console.log(user_id);

    try {
        const query = `
             SELECT * FROM message 
            WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY message_id ASC

        `;
        db.query(query, [user_id, receiverId, receiverId, user_id], (err, results) => {
            if (err) {
                console.error("Error fetching messages:", err);
                return res.status(500).json({ message: "Error fetching messages" });
            }
            res.status(200).json(results);
            // console.log(results)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching messages" });
    }
});


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    // socket.emit("Hello");
    const user_id = socket.user_id;
    userSockets.set(user_id, socket.id);

    socket.on("sendMessage", (data) => {
        // console.log(data);
        const { message_id, message_content, receiver_id } = data;
        const sender_id = user_id;
        
        //   const message_id = uuidv4(); 


        const query = `
        INSERT INTO message (message_id, message_content, sender_id, receiver_id) 
        VALUES (?, ?, ?, ?)
      `;
        db.query(
            query,
            [message_id, message_content, sender_id, receiver_id],
            (err, result) => {
                if (err) {
                    console.error("Error saving message:", err);
                } else {
                    console.log("Message saved:", message_id);


                    const fetchQuery = `
              SELECT * FROM message 
              WHERE (sender_id = ? AND receiver_id = ?)
              OR (sender_id = ? AND receiver_id = ?)
              ORDER BY message_id ASC
            `;
                    db.query(
                        fetchQuery,
                        [sender_id, receiver_id, receiver_id, sender_id],
                        (err, updatedMessages) => {
                            if (err) {
                                console.error("Error fetching updated messages:", err);
                            } else {
                                socket.emit("receiveMessage", updatedMessages); // Emit to the sender
                                
                                const receiverSocketId = userSockets.get(receiver_id);
                                console.log(receiverSocketId);
                                if (receiverSocketId) {
                                    console.log("in")
                                    io.emit("receiveMessage", updatedMessages);
                                }
                            }
                        }
                    );
                }
            }
        );
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('Backend Server Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});