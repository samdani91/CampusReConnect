const db = require('../../db'); 

const updateCommentVote = (commentId, upvotes, downvotes, callback) => {
    const query = 'UPDATE comment SET upvotes = ?, downvotes = ? WHERE comment_id = ?';
    db.query(query, [upvotes, downvotes, commentId], (err, result) => {
        if (err) {
            console.error('Error updating comment votes:', err);
            return callback(err);
        }
        callback(null, result);
    });
};

module.exports = updateCommentVote;