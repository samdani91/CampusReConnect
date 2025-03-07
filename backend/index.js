const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { Login, SignUp, LogOut, ChangePassword } = require("./Authentication")
const { ForgotPassword, verificationCodes, sendOtp } = require('./Authentication/sendCode');
const { getProfileTab, updateProfileTab, getProfileHeader } = require("./User/Dashboard")
const { getProfileSettings, updateProfileSettings, changePasswordSettings, deleteAccountSettings } = require("./User/Settings");
const { followUser, unfollowUser, isFollowingUser, getFollowersCount, getFollowingCount, getFollowers, getFollowing } = require("./User/Follow");
const { viewMessages, sendMessages, viewUserList, getUserStatus } = require("./Message")
const { storeNotifications, getNotifications } = require("./Notification")
const { createPost, editPost, deletePost, makeComment, getComment } = require("./Post");
const searchUser = require("./Search/searchUser")
const { generateSummary} = require("./geminiApi");
const { calculatePoints } = require("./Gamification/calculatePoints");
const { defineBadge } = require("./Gamification/defineBadge");
const {createCommunity, leaveCommunity} = require("./Community");
const db = require('./db');
const { Server } = require('socket.io');

const SECRET_KEY = 'authTokenKey';
const PORT = 3001;

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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

app.get('/get-user-role', authenticateToken, (req, res) => {
    const user_id = req.user_id;

    const query = 'SELECT is_student FROM user WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching user role:', err);
            return res.status(500).json({ message: 'Error fetching user role' });
        }

        if (results.length > 0) {
            const isStudent = results[0].is_student;
            return res.status(200).json({ isStudent: isStudent });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
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

app.post('/update-user-stats', authenticateToken, async (req, res) => {
    const { userId, hIndex, citationCount } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const query = `
            UPDATE spl2.user 
            SET h_index = ?, citation_count = ? 
            WHERE user_id = ?
        `;

        const values = [hIndex, citationCount, userId];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error updating user stats:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            // Call calculatePoints after updating stats
            calculatePoints(userId, (calcErr, points) => {
                if (calcErr) {
                    console.error("Error calculating points:", calcErr);
                    return res.status(500).json({ error: "Error updating points" });
                }

                res.status(200).json({ message: "Statistics and points updated successfully", points });
            });
        });

    } catch (error) {
        console.error("Error updating user stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.post('/get-user-stats', authenticateToken, (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    calculatePoints(userId, (err, updatedPoints) => {
        if (err) {
            console.error("Error calculating points:", err);
            return res.status(500).json({ error: "Error calculating points" });
        }

        const query = 'SELECT h_index, citation_count, points FROM spl2.user WHERE user_id = ?';

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching stats:', err);
                return res.status(500).json({ error: 'Error fetching stats' });
            }

            if (results.length > 0) {
                const userStats = results[0];
                res.json({
                    hIndex: userStats.h_index,
                    citationCount: userStats.citation_count,
                    points: userStats.points,
                });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        });
    });
});

app.post('/get-user-badge', authenticateToken, (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // Call defineBadge to get the user's badge
    defineBadge(userId, (err, badge) => {
        if (err) {
            console.error("Error fetching badge:", err);
            return res.status(500).json({ error: err.message || "Internal server error" });
        }

        res.json({ badge });
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

app.get('/active-user-list', authenticateToken, async (req, res) => {
    try {
        const query = `
            SELECT * FROM user WHERE status = 'active';
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching active users:', err);
                return res.status(500).json({ message: 'Error fetching active users' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No active users found' });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching active users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/is-following/:userId', authenticateToken, (req, res) => {
    const currentUserId = req.user_id;
    const userIdToCheck = req.params.userId;

    const query = `
        SELECT EXISTS (
            SELECT 1
            FROM spl2.follow
            WHERE followee_id = ? AND follower_id = ?
        ) AS isFollowing;
    `;

    db.query(query, [userIdToCheck, currentUserId], (err, result) => {
        if (err) {
            console.error('Error checking follow status:', err);
            return res.status(500).json({ message: 'Error checking follow status' });
        }
        res.json({ isFollowing: result[0].isFollowing });
    });
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
    const { publicationType, topic, title, authors, description, communityId } = req.body;
    const user_id = req.user_id;  // Get user_id from the authentication middleware
    const file = req.file ? `uploads/${req.file.filename}` : null;  // Get file path (file name)


    // Call the createPost function to insert the post into the database
    createPost(publicationType, user_id, topic, title, authors, description, file, communityId, (err, newPost) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading post' });
        }

        // Send response with new post data
        return res.status(201).json(newPost);
    });
});

app.get('/posts', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM post WHERE community_id IS NULL ORDER BY created_time DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ message: 'Error fetching posts' });
        }

        res.status(200).json(results);
    });
});

app.get('/community-posts/:communityId', authenticateToken, (req, res) => {
    const { communityId } = req.params;

    const query = 'SELECT * FROM post WHERE community_id = ? ORDER BY created_time DESC'; // Customize the query as needed

    db.query(query, [communityId],(err, results) => {
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

app.get('/get-community-posts/:userId/:communityId', authenticateToken, (req, res) => {
    const { userId,communityId } = req.params;

    const query = 'SELECT * FROM post WHERE user_id = ? AND community_id = ? ORDER BY created_time DESC';

    db.query(query, [userId,communityId], (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ message: 'Error fetching posts' });
        }
        res.status(200).json(results);
    });
});

// server.js (backend)

app.put('/update-votes/:postId', authenticateToken, (req, res) => {
    const { postId } = req.params;
    const { upvotes, downvotes } = req.body;

    const query = 'UPDATE post SET upvotes = ?, downvotes = ? WHERE post_id = ?';
    db.query(query, [upvotes, downvotes, postId], (err, result) => {
        if (err) {
            console.error('Error updating votes:', err);
            return res.status(500).json({ message: 'Error updating votes' });
        }
        res.status(200).json({ message: 'Votes updated successfully' });
    });
});

app.put('/update-post/:postId', authenticateToken, upload.single('file'), (req, res) => {
    const { postId } = req.params;
    const { publicationType, topic, title, authors, description } = req.body;
    const file = req.file ? `uploads/${req.file.filename}` : null;

    editPost(postId, publicationType, topic, title, authors, description, file, (err, updatedPost) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating post' });
        }

        return res.status(200).json(updatedPost);
    });
});

app.delete('/delete-post/:postId', authenticateToken, (req, res) => {
    const { postId } = req.params;

    deletePost(postId, (err, result) => {
        if (err) {
            if (err.message === 'Post not found') {
                return res.status(404).json({ message: 'Post not found' });
            }
            return res.status(500).json({ message: 'Error deleting post' });
        }
        res.status(200).json(result); // Send the result from the deletePost function
    });
});

app.post('/add-comment', authenticateToken, (req, res) => {
    const { postId, text, parentCommentId = null } = req.body;
    const userId = req.user_id;

    makeComment(userId, postId, text, parentCommentId, (err, newComment) => {
        if (err) {
            return res.status(500).json({ message: "Error adding comment" });
        }

        res.status(201).json(newComment);
    });
});

app.get('/get-comments/:postId', authenticateToken, (req, res) => {
    const { postId } = req.params;

    getComment(postId, (err, comments) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching comments' });
        }
        res.status(200).json(comments);
    });
});

app.delete('/delete-comment/:commentId', authenticateToken, (req, res) => {
    const { commentId } = req.params;

    const query = 'DELETE FROM comment WHERE comment_id = ?';
    db.query(query, [commentId], (err, result) => {
        if (err) {
            console.error('Error deleting comment:', err);
            return res.status(500).json({ message: 'Error deleting comment' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    });
});

app.put('/update-comment-votes/:commentId', authenticateToken, (req, res) => {
    const { commentId } = req.params;
    const { upvotes, downvotes } = req.body;

    const query = 'UPDATE comment SET upvotes = ?, downvotes = ? WHERE comment_id = ?';
    db.query(query, [upvotes, downvotes, commentId], (err, result) => {
        if (err) {
            console.error('Error updating comment votes:', err);
            return res.status(500).json({ message: 'Error updating comment votes' });
        }
        res.status(200).json({ message: 'Comment votes updated successfully' });
    });
});

app.post('/generate-post-summary', async (req, res) => {
    const { text } = req.body;

    try {
        const summary = await generateSummary(text);
        res.json({ summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ message: 'Failed to generate summary' });
    }
});

app.post('/generate-paper-summary', async (req, res) => {
    const { pdfPath } = req.body;

    try {
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(pdfBuffer);
        const pdfText = pdfData.text;

        const summary = await generateSummary(pdfText); // Use Gemini API to summarize PDF text

        res.json({ summary });
    } catch (error) {
        console.error('Error generating paper summary:', error);
        res.status(500).json({ message: 'Failed to generate paper summary' });
    }
});




//community
app.post('/create-community', authenticateToken, async (req, res) => {
    const { community_name, community_description } = req.body;
    const moderator_id = req.user_id;

    createCommunity(moderator_id, community_name, community_description, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!result.success) {
            return res.status(409).json({ message: result.message });
        }
        return res.status(201).json({ message: result.message });
    });
});

app.get('/get-communities', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM community';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching communities:', err);
            return res.status(500).json({ message: 'Error fetching communities' });
        }
        res.status(200).json(results);
    });
});

app.get('/get-user-communities', authenticateToken, (req, res) => {
    const userId = req.user_id;
    const query = 'SELECT community_id FROM user_community WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user communities:', err);
            return res.status(500).json({ message: 'Error fetching user communities' });
        }
        res.status(200).json(results);
    });
});

app.get('/get-joined-communities', authenticateToken, (req, res) => {
    const userId = req.user_id;

    const query = `
        SELECT c.community_id, c.community_name, c.community_description, c.moderator_id
        FROM spl2.community c
        JOIN spl2.user_community uc ON c.community_id = uc.community_id
        WHERE uc.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching joined communities:', err);
            return res.status(500).json({ message: 'Error fetching joined communities' });
        }

        res.status(200).json(results);
    });
});


app.post("/leave-community", authenticateToken, (req, res) => {
    const userId = req.user_id;
    const { communityId } = req.body;

    leaveCommunity(userId, communityId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (!result.success) {
            return res.status(409).json({ message: result.message });
        }
        return res.status(200).json({ message: result.message });
    });
});

app.post("/remove-member", authenticateToken, (req, res) => {
    const { userId,communityId } = req.body;


    leaveCommunity(userId, communityId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (!result.success) {
            return res.status(409).json({ message: result.message });
        }
        return res.status(200).json({ message: result.message });
    });
});

app.get('/moderator/communities', authenticateToken, (req, res) => {
    const userId = req.user_id;

    const query = `
        SELECT * 
        FROM community
        WHERE moderator_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching communities:', err);
            return res.status(500).json({ message: 'Error fetching communities' });
        }

        res.status(200).json(results);
    });
});

// Route to get members for a specific community
app.get('/community/:communityId/members', authenticateToken, async (req, res) => {
    const { communityId } = req.params;

    try {
        const results = await db.promise().query(`
            SELECT u.user_id, u.full_name, u.email
            FROM user_community uc
            JOIN user u ON uc.user_id = u.user_id
            WHERE uc.community_id = ?
        `, [communityId]);

        const members = results[0]; // Access the array of members

        // Fetch join requests for the community
        const requestsResults = await db.promise().query(
            'SELECT u.* FROM spl2.user u JOIN spl2.community_join_requests cjr ON u.user_id = cjr.user_id WHERE cjr.community_id = ?',
            [communityId]
        );

        const requests = requestsResults[0];

        res.json({ members, requests });
    } catch (error) {
        console.error('Error fetching community members:', error);
        res.status(500).json({ message: 'Failed to fetch community members' });
    }
});

app.get('/community/:communityId/posts', authenticateToken, async (req, res) => {
    const { communityId } = req.params;

    try {
        const query = `
            SELECT *
            FROM post
            WHERE community_id = ?;
        `;

        db.query(query, [communityId], (err, results) => {
            if (err) {
                console.error('Error fetching posts:', err);
                return res.status(500).json({ message: 'Error fetching posts' });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/request-join', authenticateToken, async (req, res) => {
    const { communityId } = req.body;
    const userId = req.user_id;
    try {
        await db.execute(
            'INSERT INTO community_join_requests (user_id, community_id) VALUES (?, ?)',
            [userId, communityId]
        );
        res.json({ message: 'Join request sent' });
    } catch (error) {
        console.error('Error requesting join:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/cancel-request', authenticateToken, async (req, res) => {
    const { communityId } = req.body;
    const userId = req.user_id;
    try {
        await db.execute(
            'DELETE FROM community_join_requests WHERE user_id = ? AND community_id = ?',
            [userId, communityId]
        );
        res.json({ message: 'Join request cancelled' });
    } catch (error) {
        console.error('Error cancelling request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/approve-request', authenticateToken, async (req, res) => {
    const { userId, communityId } = req.body;
    try {
        await db.execute(
            'INSERT INTO spl2.user_community (user_id, community_id) VALUES (?, ?)',
            [userId, communityId]
        );
        await db.execute(
            'DELETE FROM spl2.community_join_requests WHERE user_id = ? AND community_id = ?',
            [userId, communityId]
        );
        res.json({ message: 'Request approved' });
    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.delete('/reject-request', authenticateToken, async (req, res) => {
    const { userId, communityId } = req.body;
    try {
        await db.execute(
            'DELETE FROM spl2.community_join_requests WHERE user_id = ? AND community_id = ?',
            [userId, communityId]
        );
        res.json({ message: 'Request rejected' });
    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/get-pending-requests', authenticateToken, async (req, res) => {
    const userId = req.user_id;

    try {
        const results = await db.promise().query(
            'SELECT community_id FROM community_join_requests WHERE user_id = ?',
            [userId]
        );

        const pendingRequests = results[0].map(row => row.community_id);

        res.json(pendingRequests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/delete-community/:communityId', authenticateToken, async (req, res) => {
    const { communityId } = req.params;
    const moderatorId = req.user_id; // Assuming you have middleware to set req.user_id

    try {
        // Check if the logged-in user is the moderator of the community
        const [community] = await db.promise().execute(
            'SELECT * FROM spl2.community WHERE community_id = ? AND moderator_id = ?',
            [communityId, moderatorId]
        );

        if (community.length === 0) {
            return res.status(403).json({ message: 'You are not authorized to delete this community' });
        }

        // Delete the community
        await db.promise().execute(
            'DELETE FROM spl2.community WHERE community_id = ?',
            [communityId]
        );

        res.json({ message: 'Community deleted successfully' });
    } catch (error) {
        console.error('Error deleting community:', error);
        res.status(500).json({ message: 'Failed to delete community' });
    }
});

app.get('/community/:communityId', authenticateToken, async (req, res) => {
    const { communityId } = req.params;

    try {
        const [rows] = await db.promise().execute(
            'SELECT * FROM community WHERE community_id = ?',
            [communityId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Community not found' });
        }

        const community = rows[0];
        res.json(community);
    } catch (error) {
        console.error('Error fetching community details:', error);
        res.status(500).json({ message: 'Failed to fetch community details' });
    }
});

app.get('/community/:communityId/member', authenticateToken, async (req, res) => {
    const { communityId } = req.params;

    try {
        const [rows] = await db.promise().execute(`
            SELECT 
                u.user_id, 
                u.full_name, 
                u.department, 
                u.is_student, 
                c.moderator_id 
            FROM 
                user_community uc
            JOIN 
                user u ON uc.user_id = u.user_id
            JOIN 
                community c ON uc.community_id = c.community_id
            WHERE 
                uc.community_id = ?
        `, [communityId]);

        const members = rows.map(member => ({
            ...member,
            designation: member.is_student ? 'Student' : 'Faculty',
            role: member.user_id === member.moderator_id ? 'Moderator' : 'Member'
        }));

        res.json({ members });
    } catch (error) {
        console.error('Error fetching community members:', error);
        res.status(500).json({ message: 'Failed to fetch community members' });
    }
});

app.get('/community/:communityId/check-membership/:userId', authenticateToken, async (req, res) => {
    const { communityId, userId } = req.params;
    try {
        const [membership] = await db.promise().execute('SELECT * FROM user_community WHERE community_id = ? AND user_id = ?', [communityId, userId]);
        const isMember = membership.length > 0;
        res.json({ isMember });
    } catch (error) {
        console.error('Error checking membership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.send('Backend Server Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

