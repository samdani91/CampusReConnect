const db = require('../../db');

async function approveMember(userId, communityId) {
    try {
        await db.execute(
            'INSERT INTO spl2.user_community (user_id, community_id) VALUES (?, ?)',
            [userId, communityId]
        );
        await db.execute(
            'DELETE FROM spl2.community_join_requests WHERE user_id = ? AND community_id = ?',
            [userId, communityId]
        );
        return { message: 'Request approved' }; 
    } catch (error) {
        console.error('Error approving request:', error);
        throw error;
    }
}

module.exports = approveMember;