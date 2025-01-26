const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { Login, SignUp, LogOut, ChangePassword} = require("./Authentication")
const { ForgotPassword, verificationCodes, sendOtp } = require('./Authentication/sendCode');
const { getProfileTab, updateProfileTab} = require("./Profile/Dashboard")
const { getProfileSettings, updateProfileSettings, changePasswordSettings,deleteAccountSettings} = require("./Profile/Settings");
const { viewMessages, sendMessages, viewUserList} = require("./Message")
const db = require('./db');
const { Server } = require('socket.io');

const SECRET_KEY = 'authTokenKey';
const PORT = 3001;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
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
        await SignUp(name, email, department, role, password, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    try {
        await sendOtp(email, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    Login(email, password, (err, isValid, user) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (isValid) {
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email },
                SECRET_KEY,
                { expiresIn: '24h' }
            );


            res.cookie('authToken', token, { httpOnly: true, secure: false });
            return res.status(200).json({ message: 'Login Successful' });
        } else {
            return res.status(401).json({ message: 'Credentials Mismatch' });
        }
    });
});

app.post('/logout', async (req, res) => {
    try {
        await LogOut(req, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        await ForgotPassword(email, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


app.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Code is required' });
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
        await ChangePassword(email, newPassword, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


app.put('/update-user-details', authenticateToken, (req, res) => {
    const user_id = req.user_id;
    let { field, value } = req.body;

    const allowedFields = ['full_name', 'degree', 'department'];

    updateProfileSettings(user_id, field, value, allowedFields, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error updating user details' });
        }

        if (result.invalidField) {
            return res.status(400).json({ message: 'Invalid field for update' });
        }

        if (result.userNotFound) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (result.success) {
            if (field === "full_name") field = "Name";
            return res.status(200).json({ message: `${field} updated successfully` });
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



app.get('/user-list', authenticateToken, async (req, res) => {
    try {
        const results = await viewUserList();
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
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

    viewMessages(user_id, receiverId, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching messages" });
        }
        res.status(200).json(results);
    });
});


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const user_id = socket.user_id;
    userSockets.set(user_id, socket.id);

    socket.on("sendMessage", (data) => {
        // console.log(data);
        // const { message_id, message_content, receiver_id } = data;
        // const sender_id = user_id;
        sendMessages(data, user_id, socket, io, userSockets);
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