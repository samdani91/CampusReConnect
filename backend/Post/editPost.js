const db = require('../db'); 

const editPost = (postId, publicationType, topic, title, authors, description, file, callback) => {
    let query = 'UPDATE post SET post_type = ?, topic = ?, title = ?, authors = ?, description = ?';
    let params = [publicationType, topic, title, authors, description];

    if (file) {
        query += ', attachment = ?';
        params.push(file);
    }

    query += ' WHERE post_id = ?';
    params.push(postId);

    db.query(query, params, (err, results) => {
        if (err) {
            return callback(err);
        }

        // Return the updated post data
        const updatedPost = {
            post_id: postId,
            publicationType: publicationType,
            topic: topic,
            title: title,
            authors: authors,
            description: description,
            attachment: file,
        };
        return callback(null, updatedPost);
    });
};

module.exports = editPost;