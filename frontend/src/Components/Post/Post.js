import React, { useState } from 'react';
import VoteButton from './VoteButton';
import Comment from './Comment';
import AddComment from './AddComment';

const Post = ({ title, description, authors, pdfUrl, postType, date }) => {
    const [votes, setVotes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);

    const handleVote = (type) => {
        setVotes(type === 'up' ? votes + 1 : votes - 1);
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

    return (
        <div className="card mb-4">
            <div className="card-body text-start">
                <h2 className="card-title">{title}</h2>
                <p className="card-text" style={{ whiteSpace: 'pre-line' }}>{description}</p>
                <p className="card-text my-3">
                    <strong>Authors:</strong> {authors.join(', ')}
                </p>
                <div className="d-flex align-items-center my-3"> {/* Meta info below authors */}
                    <span className="badge bg-secondary me-2 text-uppercase">{postType}</span>
                    <span className="text-muted small">
                        {date}
                    </span>
                </div>


                <div className="d-flex justify-content-between align-items-center">
                    <VoteButton onVote={handleVote} votes={votes} />
                    {pdfUrl && (
                        <a href={pdfUrl} className="btn btn-primary" download>
                            Download PDF
                        </a>
                    )}
                </div>

                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center"> {/* Comments header */}
                        <h3>Comments</h3>
                        <button className="btn btn-sm btn-outline-secondary" onClick={toggleComments}>
                            {showComments ? 'Hide Comments' : 'Show Comments'}
                        </button>
                    </div>

                    {showComments && ( // Conditionally render comments
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