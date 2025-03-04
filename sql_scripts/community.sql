CREATE TABLE spl2.community (
    community_id INT AUTO_INCREMENT PRIMARY KEY,
    community_name VARCHAR(255) NOT NULL,
    community_description TEXT,
    moderator_id VARCHAR(30) NOT NULL,
    FOREIGN KEY (moderator_id) REFERENCES spl2.user(user_id)
);