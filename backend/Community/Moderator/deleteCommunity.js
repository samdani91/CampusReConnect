const db = require("../../db");

async function deleteCommunity(communityId, moderatorId) {
    try {
        const [community] = await db.promise().execute(
            'SELECT * FROM spl2.community WHERE community_id = ? AND moderator_id = ?',
            [communityId, moderatorId]
        );

        if (community.length === 0) {
            return { status: 403, message: 'You are not authorized to delete this community' };
        }

        await db.promise().execute(
            'DELETE FROM spl2.community WHERE community_id = ?',
            [communityId]
        );

        return { message: 'Community deleted successfully' };
    } catch (error) {
        console.error('Error deleting community:', error);
        return { status: 500, message: 'Failed to delete community' };
    }
}

module.exports = deleteCommunity;