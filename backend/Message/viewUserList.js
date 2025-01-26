const db = require('../db');

async function viewUserList() {
    const sql = `
        SELECT 
            user_id AS id, 
            full_name AS name, 
            department
        FROM SPL2.User
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching user list:', err);
                reject(new Error('Internal server error'));
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = viewUserList;
