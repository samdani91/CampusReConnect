CREATE TABLE spl2.comment (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    parent_comment_id INT NULL,
    upvotes INT(5) DEFAULT 0,
    downvotes INT(5) DEFAULT 0,
    user_id VARCHAR(30),
    post_id VARCHAR(100),
    comment_content TEXT,
    created_date VARCHAR(50),

    FOREIGN KEY (user_id) REFERENCES spl2.user(user_id),
    FOREIGN KEY (post_id) REFERENCES spl2.post(post_id),
    FOREIGN KEY (parent_comment_id) REFERENCES spl2.comment(comment_id) ON DELETE CASCADE
);