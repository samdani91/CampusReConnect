const db = require('../../db');

const getComment = (postId, callback) => {
    const query = `
        SELECT 
            c.comment_id, 
            c.user_id, 
            c.post_id, 
            c.comment_content, 
            c.parent_comment_id,
            c.created_date,
            u.full_name AS author,
            c.upvotes,
            c.downvotes
        FROM comment c
        JOIN user u ON c.user_id = u.user_id
        WHERE c.post_id = ?    
    `;

    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err);
            return callback(err, null);
        }

        const commentMap = {};
        results.forEach(comment => {
            comment.replies = [];
            commentMap[comment.comment_id] = comment;
        });

        const structuredComments = [];
        results.forEach(comment => {
            if (comment.parent_comment_id) {
                if (commentMap[comment.parent_comment_id]) {
                    commentMap[comment.parent_comment_id].replies.push(comment);
                }
            } else {
                structuredComments.push(comment);
            }
        });

        return callback(null, structuredComments);
    });
};

module.exports = getComment;
