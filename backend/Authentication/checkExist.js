const db = require("./db");

function isFacultyEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@it\.du\.ac\.bd$/;    ;
    return emailRegex.test(email);
}

function isStudentEmail(email) {
    const studentEmailRegex = /^[a-zA-Z]+-\d+-\d{10}@it\.du\.ac\.bd$/;
    return studentEmailRegex.test(email);
}

function isEmailExist(email, callback) {
    const sql = "SELECT COUNT(*) AS count FROM user WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        // If count > 0, the email exists
        const emailExists = results[0].count > 0;
        callback(null, emailExists);
    });
}

module.exports = { isEmailExist, isStudentEmail, isFacultyEmail };
