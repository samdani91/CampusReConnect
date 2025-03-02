const db = require('../db');

const deletePost = (postId, callback) => {
    const query = 'DELETE FROM post WHERE post_id = ?';
    db.query(query, [postId], (err, result) => {
        if (err) {
            console.error('Error deleting post:', err);
            return callback(err, null); // Pass the error to the callback
        }
        if (result.affectedRows === 0) {
            return callback(new Error('Post not found'), null); // Pass a "not found" error
        }
        callback(null, { message: 'Post deleted successfully' }); // Pass success message
    });
};

module.exports = deletePost;