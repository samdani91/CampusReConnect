DELIMITER $$

CREATE TRIGGER delete_all_on_inactive_status
AFTER UPDATE ON spl2.user
FOR EACH ROW
BEGIN
    IF NEW.status = 'inactive' AND OLD.status != 'inactive' THEN
        DELETE FROM spl2.post WHERE user_id = OLD.user_id;
        DELETE FROM spl2.community WHERE moderator_id = OLD.user_id;
        DELETE FROM spl2.comment WHERE user_id = OLD.user_id;
        DELETE FROM spl2.notification WHERE sender_id = OLD.user_id OR receiver_id = OLD.user_id;
        DELETE FROM spl2.follow WHERE followee_id = OLD.user_id OR follower_id = OLD.user_id;
    END IF;
END$$

DELIMITER ;

-- DROP TRIGGER IF EXISTS delete_posts_community_comment_on_inactive_status;
