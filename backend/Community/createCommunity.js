const db = require("../db");
const joinCommunity = require("./joinCommunity")

const createCommunity = (moderator_id, community_name, community_description, callback) => {
    try {
        // Check if the community name already exists
        db.query(
            'SELECT * FROM community WHERE community_name = ?',
            [community_name],
            (err, results) => {
                if (err) {
                    console.error('Error checking existing community:', err);
                    return callback(err, null);
                }

                if (results.length > 0) {
                    return callback(null, { success: false, message: 'Community with this name already exists' });
                }

                // Insert new community into database
                db.query(
                    'INSERT INTO community (community_name, community_description, moderator_id) VALUES (?, ?, ?)',
                    [community_name, community_description, moderator_id],
                    (err, result) => {
                        if (err) {
                            console.error('Error inserting community:', err);
                            return callback(err, null);
                        }

                        if (result.affectedRows === 1) {
                            const communityId = result.insertId; 

                            joinCommunity(moderator_id, communityId, (err, joinResult) => {
                                if (err) {
                                    console.error('Error joining community:', err);
                                    return callback(err, null);
                                }
                                return callback(null, { success: true, message: 'Community created successfully' });
                            });
                        } else {
                            return callback(null, { success: false, message: 'Failed to create community' });
                        }
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error creating community:', error);
        return callback(error, null);
    }
};

module.exports = createCommunity;
