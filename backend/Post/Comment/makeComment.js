const db = require('../../db');

const makeComment = (userId, postId, text, parentCommentId, callback) => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const date = `${day} ${month}, ${year}`;
    const query = `INSERT INTO comment (user_id, post_id, comment_content, parent_comment_id,created_date) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [userId, postId, text, parentCommentId, date], (err, result) => {
        if (err) {
            return callback(err, null);
        }

        // Fetch user's name from the database
        const getUserQuery = `SELECT full_name FROM user WHERE user_id = ?`;
        db.query(getUserQuery, [userId], (userErr, userResult) => {
            if (userErr) {
                return callback(userErr, null);
            }

            if (userResult.length === 0) {
                return callback(new Error("User not found"), null);
            }

            const username = userResult[0].full_name;

            const newComment = {
                comment_id: result.insertId,
                comment_content:text,
                author: username, // Use fetched username
                upvotes: 0,
                downvotes: 0,
                parent_comment_id: parentCommentId,
                created_date: date,
                replies: []
            };

            return callback(null, newComment);
        });
    });
};

module.exports = makeComment;