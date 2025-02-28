import React, { useState, useEffect } from 'react';
import VoteButton from './VoteButton';
import Comment from './Comment';
import AddComment from './AddComment';
import axios from 'axios';

const Post = ({ postId, title, topic, description, authors, pdfUrl, postType, date, initialUpvotes, initialDownvotes }) => {
    const [voteStatus, setVoteStatus] = useState(null);
    const [upVotes, setUpVotes] = useState(initialUpvotes || 0);
    const [downVotes, setDownVotes] = useState(initialDownvotes || 0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        setUpVotes(initialUpvotes || 0);
        setDownVotes(initialDownvotes || 0);

        const storedVoteStatus = localStorage.getItem(`voteStatus-${postId}`);
        if (storedVoteStatus) {
            setVoteStatus(storedVoteStatus);
        }
    }, [initialUpvotes, initialDownvotes, postId]);

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
    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            setComments([
                ...comments,
                {
                    id: Date.now(),
                    text: newComment,
                    author: 'Current User',
                    votes: 0,
                    replies: [],
                },
            ]);
            setNewComment('');
        }
    };

    const handleReply = (commentId, replyText) => {
        setComments(
            comments.map((comment) =>
                comment.id === commentId
                    ? {
                          ...comment,
                          replies: [
                              ...comment.replies,
                              {
                                  id: Date.now(),
                                  text: replyText,
                                  author: 'Current User',
                                  votes: 0,
                              },
                          ],
                      }
                    : comment
            )
        );
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const descriptionSentences = description.split('.').filter(sentence => sentence.trim() !== ''); //split by fullstop, and remove empty sentences
    const isLongDescription = descriptionSentences.length > 5;

    return (
        <div className="card mb-2">
            <div className="card-body text-start">
                <h2 className="card-title">{title}</h2>
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
                                <Comment key={comment.id} comment={comment} onReply={handleReply} />
                            ))}
                            <AddComment
                                onAdd={handleAddComment}
                                comment={newComment}
                                setComment={setNewComment}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Post;