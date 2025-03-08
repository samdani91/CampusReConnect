const db = require('../db');  // Ensure db connection is correctly imported
const { v4: uuidv4 } = require('uuid');

// Function to create a post in the database
const createPost = (publicationType, user_id, topic, title, authors, description, file, communityId, callback) => {
    const post_id = uuidv4();
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const date = `${day} ${month}, ${year}`;
    const time = now.toISOString().slice(0, 19).replace('T', ' '); //for datetime

    const query = `
    INSERT INTO post (post_id, user_id, topic, post_type, title, authors, description, attachment, upvotes, downvotes, community_id, created_date,created_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
        post_id,
        user_id,
        topic,
        publicationType,
        title,
        authors,
        description,
        file,  // Save file path
        0,   // Assuming upvotes start from 0
        0,   // Assuming downvotes start from 0
        communityId,  // Replace with actual community_id if needed
        date,
        time,
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error saving post:', err);
            return callback(err, null);
        }

        // Return the new post data as a response
        const newPost = {
            id: result.insertId,
            user_id,
            topic,
            title,
            description,
            file,
            date,
        };
        callback(null, newPost);
    });
};

module.exports = createPost;