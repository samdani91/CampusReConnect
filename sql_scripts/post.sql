CREATE TABLE spl2.post (
    post_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(30),
    post_type VARCHAR(30),
    topic VARCHAR(100),
    title VARCHAR(400),
    authors VARCHAR(100),
    description VARCHAR(10000),
    attachment VARCHAR(200),
    upvotes INT(5),
    downvotes INT(5),
    created_date VARCHAR(50),
    created_time DATETIME,
    community_id VARCHAR(30)
    -- FOREIGN KEY (user_id) REFERENCES spl2.user(user_id)  -- Assuming a Users table exists
);
