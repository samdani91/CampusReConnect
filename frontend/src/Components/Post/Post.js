import React, { useState, useEffect } from 'react';
import VoteButton from './VoteButton';
import Comment from './Comment';
import AddComment from './AddComment';
import axios from 'axios';
import "./Post.css"

const Post = ({ postId, title, topic, description, authors, pdfUrl, postType, date, initialUpvotes, initialDownvotes, postUserId, onDeletePost }) => {
    const [voteStatus, setVoteStatus] = useState(null);
    const [upVotes, setUpVotes] = useState(initialUpvotes || 0);
    const [downVotes, setDownVotes] = useState(initialDownvotes || 0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:3001/get-userId', { withCredentials: true });
                setCurrentUserId(response.data.user_id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };
        fetchUserId();
    },[]);

    useEffect(() => {
        setUpVotes(initialUpvotes || 0);
        setDownVotes(initialDownvotes || 0);

        const storedVoteStatus = localStorage.getItem(`voteStatus-${postId}`);
        if (storedVoteStatus) {
            setVoteStatus(storedVoteStatus);
        }
        fetchComments();

    }, [initialUpvotes, initialDownvotes, postId, comments]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/get-comments/${postId}`, {
                withCredentials: true,
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleVote = (type) => {
        let newUpVotes = upVotes;
        let newDownVotes = downVotes;
        let newVoteStatus = null;

        if (type === 'up') {
            if (voteStatus === 'up') {
                newUpVotes--;
                newVoteStatus = null;
            } else {
                newUpVotes++;
                if (voteStatus === 'down') newDownVotes--;
                newVoteStatus = 'up';
            }
        } else if (type === 'down') {
            if (voteStatus === 'down') {
                newDownVotes--;
                newVoteStatus = null;
            } else {
                newDownVotes++;
                if (voteStatus === 'up') newUpVotes--;
                newVoteStatus = 'down';
            }
        }

        setUpVotes(newUpVotes);
        setDownVotes(newDownVotes);
        setVoteStatus(newVoteStatus);

        localStorage.setItem(`voteStatus-${postId}`, newVoteStatus);

        updateVoteCount(postId, newUpVotes, newDownVotes);
    };

    const updateVoteCount = async (postId, upvotes, downvotes) => {
        try {
            await axios.put(
                `http://localhost:3001/update-votes/${postId}`,
                { upvotes, downvotes },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (error) {
            console.error('Error updating vote count:', error);
        }
    };
    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            try {
                const response = await axios.post(
                    'http://localhost:3001/add-comment',
                    { postId: postId, text: newComment },
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setComments([...comments, response.data]); // Add new comment to state
                setNewComment(''); // Clear input field
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const handleReply = async (commentId, replyText) => {
        if (replyText.trim() !== '') {
            try {
                const response = await axios.post(
                    'http://localhost:3001/add-comment',
                    { postId: postId, text: replyText, parentCommentId: commentId },
                    { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
                );

                const newReply = response.data;

                // Update comments state to include the new reply in the correct parent
                setComments(prevComments => {
                    const addReplyToComment = (commentsList) => {
                        return commentsList.map(comment => {
                            if (comment.comment_id === commentId) {
                                return {
                                    ...comment,
                                    replies: [...comment.replies, newReply]
                                };
                            } else if (comment.replies.length > 0) {
                                return {
                                    ...comment,
                                    replies: addReplyToComment(comment.replies)
                                };
                            }
                            return comment;
                        });
                    };

                    return addReplyToComment(prevComments);
                });

            } catch (error) {
                console.error('Error adding reply:', error);
            }
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(prevComments => {
            const deleteCommentRecursive = (commentsList) => {
                return commentsList.map(comment => {
                    if (comment.comment_id === commentId) {
                        return null;
                    } else if (comment.replies && comment.replies.length > 0) {
                        const updatedReplies = deleteCommentRecursive(comment.replies);
                        return { ...comment, replies: updatedReplies };
                    }
                    return comment;
                }).filter(comment => comment !== null);
            };
    
            return deleteCommentRecursive(prevComments);
        });
    };

    const handleDeletePost = async () => {
        try {
            await axios.delete(`http://localhost:3001/delete-post/${postId}`, {
                withCredentials: true,
            });
            onDeletePost(postId); // Call onDeletePost to update parent component
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };


    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = () => {
        handleDeletePost();
        setShowDeleteConfirmation(false);
        setShowDeleteButton(false); // Hide the delete button after deleting
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const descriptionSentences = description.split('.').filter(sentence => sentence.trim() !== ''); //split by fullstop, and remove empty sentences
    const isLongDescription = descriptionSentences.length > 5;

    return (
        <div className="card mb-2">
            <div className="card-body text-start">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="card-title mb-0">{title}</h2>
                    {currentUserId === postUserId && (
                        <div className="dropdown">
                        <button
                            className="btn btn-sm btn-link p-0"
                            type="button"
                            id={`postDropdownMenuButton-${postId}`} // Unique ID for each dropdown
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            onClick={() => setShowDeleteButton(!showDeleteButton)}
                        >
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul
                            className="dropdown-menu bg-danger "
                            aria-labelledby={`postDropdownMenuButton-${postId}`} // Match the ID here
                        >
                            <li>
                                <button className="dropdown-item deleteButton text-white" onClick={handleDeleteClick}>
                                    Delete Post
                                </button>
                            </li>
                        </ul>
                    </div>
                    )}
                </div>

                <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                    {showFullDescription || !isLongDescription
                        ? description
                        : descriptionSentences.slice(0, 5).join('. ') + (descriptionSentences.length > 5 ? '...' : '')}
                </p>
                {isLongDescription && (
                    <button
                        className="btn btn-link p-0"
                        onClick={toggleDescription}
                    >
                        {showFullDescription ? 'See Less' : 'See More'}
                    </button>
                )}
                <p className="card-text my-3">
                    <strong>Authors:</strong> {authors.join(', ')}
                </p>

                <p className="card-text my-3">
                    <strong>Topic:</strong> {topic}
                </p>

                <div className="d-flex align-items-center my-3">
                    <span className="badge bg-secondary me-2 text-uppercase">{postType}</span>
                    <span className="text-muted small">{date}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <VoteButton onVote={handleVote} upvotes={upVotes} downvotes={downVotes} voteStatus={voteStatus} />
                    {pdfUrl && (
                        <a href={pdfUrl} className="btn btn-primary" download>
                            Download PDF
                        </a>
                    )}
                </div>

                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>Comments</h3>
                        <button className="btn btn-sm btn-outline-secondary" onClick={toggleComments}>
                            {showComments ? 'Hide Comments' : 'Show Comments'}
                        </button>
                    </div>

                    {showComments && (
                        <div>
                            {comments.map((comment) => (
                                <Comment key={comment.comment_id} comment={comment} onReply={handleReply} onDelete={handleDeleteComment} currentUserId={currentUserId} />
                            ))}
                            <AddComment
                                onAdd={handleAddComment}
                                comment={newComment}
                                setComment={setNewComment}
                            />
                        </div>
                    )}
                </div>

                {showDeleteConfirmation && (
                    <div className="modal d-flex align-items-center justify-content-center" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={handleCancelDelete}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this post?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>No</button>
                                    <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Post;