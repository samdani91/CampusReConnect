import React from 'react';

const AddComment = ({ onAdd, comment, setComment, buttonLabel = 'Add Comment' }) => {
    return (
        <div className="mb-3">
            <textarea
                className="form-control"
                rows="3"
                placeholder="Add your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button className="btn btn-primary mt-2" onClick={onAdd}>
                {buttonLabel}
            </button>
        </div>
    );
};

export default AddComment;