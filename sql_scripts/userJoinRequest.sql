CREATE TABLE spl2.community_join_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL,
    community_id INT NOT NULL,
    request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES spl2.user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (community_id) REFERENCES spl2.community(community_id) ON DELETE CASCADE,
    UNIQUE (user_id, community_id)
);