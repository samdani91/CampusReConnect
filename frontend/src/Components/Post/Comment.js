import React, { useState } from 'react';
import VoteButton from './VoteButton';
import AddComment from './AddComment';

const Comment = ({ comment, onReply }) => {
    const [replyText, setReplyText] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);

    const handleReplyClick = () => {
        setShowReplyInput(true);
    };

    const handleActualReply = () => {
        onReply(comment.id, replyText);
        setReplyText('');
        setShowReplyInput(false);
    };

    return (
        <div className="mb-3 p-2 border rounded"> {/* Comment container */}
            <p>{comment.text}</p>
            <p className="text-muted small">
                By {comment.author} - {new Date(comment.id).toLocaleDateString()} {/* Display comment time */}
            </p>
            <div className="d-flex justify-content-between align-items-center">
                <VoteButton votes={comment.votes} />
                <button className="btn btn-sm btn-link" onClick={handleReplyClick}>
                    Reply
                </button>
            </div>
            {showReplyInput && (
                <AddComment
                    onAdd={handleActualReply}
                    comment={replyText}
                    setComment={setReplyText}
                    buttonLabel="Submit Reply"
                />
            )}

            {/* Render replies recursively */}
            {comment.replies.length > 0 && (
                <div className="ms-4"> {/* Indent replies */}
                    {comment.replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;