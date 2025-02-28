import React from 'react';

const VoteButton = ({ onVote, upvotes, downvotes, voteStatus }) => {
    return (
        <div>
            <button
                className={`btn btn-sm ${voteStatus === 'up' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => onVote('up')}
            >
                Upvote ({upvotes})
            </button>{' '}
            <button
                className={`btn btn-sm ${voteStatus === 'down' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => onVote('down')}
            >
                Downvote ({downvotes})
            </button>
        </div>
    );
};

export default VoteButton;
