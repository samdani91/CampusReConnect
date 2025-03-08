CREATE TABLE spl2.Message (
    message_id VARCHAR(100) PRIMARY KEY,
    message_content VARCHAR(1000),
    sender_id VARCHAR(30),
    receiver_id VARCHAR(30),
    message_time VARCHAR(100)
);