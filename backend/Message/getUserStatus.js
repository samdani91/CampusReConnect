const db = require("../db");

function getUserStatus(userId, callback) {
  const query = "SELECT status FROM SPL2.User WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, { isActive: false, message: "User not found" });
    }

    const isActive = results[0].status === "active";
    return callback(null, { isActive });
  });
}

module.exports = getUserStatus;
