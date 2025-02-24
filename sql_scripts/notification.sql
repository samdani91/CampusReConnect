CREATE TABLE spl2.notification (
    notification_id VARCHAR(50) PRIMARY KEY,
    sender_id VARCHAR(30),
    receiver_id VARCHAR(30),
    notification_content VARCHAR(1000)
);