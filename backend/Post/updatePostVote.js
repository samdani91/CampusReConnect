const db = require('../db'); 

const updatePostVote = (postId, upvotes, downvotes, callback) => {
    const query = 'UPDATE post SET upvotes = ?, downvotes = ? WHERE post_id = ?';
    db.query(query, [upvotes, downvotes, postId], (err, result) => {
        if (err) {
            console.error('Error updating post votes:', err);
            return callback(err);
        }
        callback(null, result);
    });
};

module.exports = updatePostVote;