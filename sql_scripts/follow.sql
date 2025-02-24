CREATE TABLE spl2.follow (
    followee_id VARCHAR(30),
    follower_id VARCHAR(30),
    PRIMARY KEY (followee_id, follower_id)
);