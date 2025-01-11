const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: "root",
    password: "root",
    database: "spl2",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = db;