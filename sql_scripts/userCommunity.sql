CREATE TABLE spl2.user_community (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL,
    community_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES spl2.user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (community_id) REFERENCES spl2.community(community_id) ON DELETE CASCADE,
    UNIQUE (user_id, community_id)
);
