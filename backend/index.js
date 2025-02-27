const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { Login, SignUp, LogOut, ChangePassword } = require("./Authentication")
const { ForgotPassword, verificationCodes, sendOtp } = require('./Authentication/sendCode');
const { getProfileTab, updateProfileTab, getProfileHeader } = require("./User/Dashboard")
const { getProfileSettings, updateProfileSettings, changePasswordSettings, deleteAccountSettings } = require("./User/Settings");
const { followUser, unfollowUser, isFollowingUser, getFollowersCount, getFollowingCount, getFollowers, getFollowing } = require("./User/Follow");
const { viewMessages, sendMessages, viewUserList, getUserStatus } = require("./Message")
const { storeNotifications, getNotifications } = require("./Notification")
const { createPost } = require("./Post");
const searchUser = require("./Search/searchUser")
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Folder to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp for unique filenames
    },
});

const upload = multer({ storage: storage });

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

app.get("/user-status/:userId", authenticateToken, async (req, res) => {
    const { userId } = req.params;

    getUserStatus(userId, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching user status" });
        }
        res.status(200).json(results);
    });
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

app.get('/get-headerData/:userId', authenticateToken, (req, res) => {
    const user_id = req.params;

    getProfileHeader(user_id, (err, result) => {
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

app.get('/get-profileTab/:userId', authenticateToken, (req, res) => {
    const user_id = req.params

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
        sendMessages(data, user_id, socket, io, userSockets);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});



//search

app.get('/search-users', authenticateToken, async (req, res) => {
    const { name } = req.query;  // Get the name parameter from the query string

    // Ensure a search term is provided
    if (!name) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        // Call the search function from the userService
        const users = await searchUser(name);

        // If no results are found, send a 404 response
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Return the found users
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// Follow Endpoint
app.post('/follow/:followeeId', authenticateToken, async (req, res) => {
    const { followeeId } = req.params;
    const followerId = req.user_id;


    if (followeeId === followerId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const result = await followUser(followeeId, followerId);


    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
});

// Unfollow Endpoint
app.delete('/unfollow/:followeeId', authenticateToken, async (req, res) => {
    const { followeeId } = req.params;
    const followerId = req.user_id;

    const result = await unfollowUser(followeeId, followerId);
    if (result.success) {
        res.status(200).json({ message: result.message });
    } else if (result.message === 'Follow relationship not found') {
        res.status(404).json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
});

// Check if Following
app.get('/is-following/:followeeId', authenticateToken, async (req, res) => {
    const { followeeId } = req.params;
    const followerId = req.user_id;

    const result = await isFollowingUser(followeeId, followerId);
    if (result.success === false) {
        return res.status(500).json({ message: result.message });
    }
    res.status(200).json({ isFollowing: result.isFollowing });
});

// Get Followers/Following Count
app.get('/followers/count/:userId', async (req, res) => {
    const { userId } = req.params;

    const result = await getFollowersCount(userId);

    if (result.success === false) {
        return res.status(500).json({ message: result.message });
    }
    res.status(200).json({ count: result.count });
});

app.get('/following/count/:userId', async (req, res) => {
    const { userId } = req.params;

    const result = await getFollowingCount(userId);
    if (result.success === false) {
        return res.status(500).json({ message: result.message });
    }
    res.status(200).json({ count: result.count });
});

app.get('/get-followers/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await getFollowers(userId);

    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json({ message: result.message });
    }
});

app.get('/get-following/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await getFollowing(userId);

    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(500).json({ message: result.message });
    }
});

//notification
app.post('/store-notification', authenticateToken, async (req, res) => {
    const { id, senderId, receiverId, content } = req.body;

    const result = await storeNotifications(id, senderId, receiverId, content);
    if (result.success) {
        res.send(result.message);
    } else {
        res.status(500).send(result.message);
    }

});

app.get('/notifications/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    const result = await getNotifications(userId);
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(500).send(result.message);
    }
});


//post

app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
    const { publicationType, topic, title, authors, description } = req.body;
    const user_id = req.user_id;  // Get user_id from the authentication middleware
    const file = req.file ? req.file.filename : null;  // Get file path (file name)

    // Call the createPost function to insert the post into the database
    createPost(publicationType, user_id, topic, title, authors, description, file, (err, newPost) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading post' });
        }

        // Send response with new post data
        return res.status(201).json(newPost);
    });
});

app.get('/posts', authenticateToken, (req, res) => {
    // Query to fetch posts from the Post table
    const query = 'SELECT * FROM post ORDER BY post_id DESC'; // Customize the query as needed

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ message: 'Error fetching posts' });
        }

        // Send the posts back to the client
        res.status(200).json(results);
    });
});

app.get('/get-posts/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;

    const query = 'SELECT * FROM post WHERE user_id = ? ORDER BY created_time DESC';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ message: 'Error fetching posts' });
        }
        res.status(200).json(results);
    });
});

app.get('/', (req, res) => {
    res.send('Backend Server Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});