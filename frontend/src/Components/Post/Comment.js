import React, { useState, useEffect } from 'react';
import VoteButton from './VoteButton';
import AddComment from './AddComment';
import axios from 'axios';

const Comment = ({ comment, onReply, onDelete, currentUserId,currentUserName,postTitle }) => {
    const [replyText, setReplyText] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [voteStatus, setVoteStatus] = useState(null);
    const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
    const [downvotes, setDownvotes] = useState(comment.downvotes || 0);

    useEffect(() => {
        setUpvotes(comment.upvotes || 0);
        setDownvotes(comment.downvotes || 0);

        const storedVoteStatus = localStorage.getItem(`commentVoteStatus-${comment.comment_id}`);
        if (storedVoteStatus) {
            setVoteStatus(storedVoteStatus);
        }
    }, [comment.upvotes, comment.downvotes, comment.comment_id]);

    const handleVote = async (type) => {
        let newUpvotes = upvotes;
        let newDownvotes = downvotes;
        let newVoteStatus = null;

        if (type === 'up') {
            if (voteStatus === 'up') {
                newUpvotes--;
                newVoteStatus = null;
            } else {
                newUpvotes++;
                if (voteStatus === 'down') newDownvotes--;
                newVoteStatus = 'up';
            }
        } else if (type === 'down') {
            if (voteStatus === 'down') {
                newDownvotes--;
                newVoteStatus = null;
            } else {
                newDownvotes++;
                if (voteStatus === 'up') newUpvotes--;
                newVoteStatus = 'down';
            }
        }

        setUpvotes(newUpvotes);
        setDownvotes(newDownvotes);
        setVoteStatus(newVoteStatus);

        localStorage.setItem(`commentVoteStatus-${comment.comment_id}`, newVoteStatus);

        try {
            await axios.put(
                `http://localhost:3001/update-comment-votes/${comment.comment_id}`,
                { upvotes: newUpvotes, downvotes: newDownvotes },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );

            const name = currentUserName.full_name;
            const voteAction = type === 'up' ? 'upvoted' : 'downvoted';  // Evaluate the vote action

            if (currentUserId !== comment.user_id) {
                try {
                    await axios.post('http://localhost:3001/store-notification', {
                        id: Date.now(),
                        senderId: currentUserId,
                        receiverId: comment.user_id,
                        content: `${name} ${voteAction} your comment <b>${comment.comment_content}</b> on post <b>${postTitle}</b>.`,  // Insert the evaluated action
                    }, {
                        withCredentials: true
                    });
                } catch (error) {
                    console.error('Error sending vote notification:', error);
                }
            }
        } catch (error) {
            console.error('Error updating comment votes:', error);
        }
    };



    const handleReplyClick = () => {
        setShowReplyInput(true);
    };

    const handleActualReply = () => {
        onReply(comment.comment_id, replyText, comment.comment_content);
        setReplyText('');
        setShowReplyInput(false);
    };

    const handleDeleteClick = async () => {
        try {
            await axios.delete(`http://localhost:3001/delete-comment/${comment.comment_id}`, {
                withCredentials: true,
            });
            onDelete(comment.comment_id);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="mb-3 p-2 border rounded">
            <p>{comment.comment_content}</p>
            <p className="text-muted small">
                By {comment.author} - {comment.created_date}
            </p>
            <div className="d-flex justify-content-between align-items-center">
                <VoteButton
                    onVote={handleVote}
                    upvotes={upvotes}
                    downvotes={downvotes}
                    voteStatus={voteStatus}
                // Pass commentId to VoteButton
                />

                <div>
                    {comment.user_id === currentUserId && (
                        <button className="btn btn-sm btn-link" onClick={handleDeleteClick}>
                            Delete
                        </button>
                    )}
                    <button className="btn btn-sm btn-link" onClick={handleReplyClick}>
                        Reply
                    </button>
                </div>
            </div>
            {showReplyInput && (
                <AddComment
                    onAdd={handleActualReply}
                    comment={replyText}
                    setComment={setReplyText}
                    buttonLabel="Submit Reply"
                />
            )}


            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <div className="ms-4">
                    {comment.replies.map((reply) => (
                        <Comment key={reply.comment_id} comment={reply} onReply={onReply} onDelete={onDelete} currentUserId={currentUserId} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;