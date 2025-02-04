import React from 'react';

const VoteButton = ({ onVote, votes }) => {
    return (
        <div>
            <button className="btn btn-sm btn-success" onClick={() => onVote('up')}>
                Upvote ({votes})
            </button>{' '}
            <button className="btn btn-sm btn-danger" onClick={() => onVote('down')}>
                Downvote
            </button>
        </div>
    );
};

export default VoteButton;