const db = require('../db');

const searchUser = async (name) => {
    try {
        const query = `
            SELECT user_id, full_name, department, degree 
            FROM user 
            WHERE full_name LIKE ? AND status = 'active';
        `;

        const [rows] = await db.promise().query(query, [`%${name}%`]);

        if (rows.length === 0) {
            throw new Error('No users found');
        }

        return rows;
    } catch (error) {
        throw new Error('Error searching users');
    }
};

module.exports = searchUser;
