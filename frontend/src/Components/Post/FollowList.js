import React from 'react';

const FollowList = () => {
    const followers = [ // Replace with dynamic data fetching later
        { name: 'xyz', relationship: 'Department colleague' },
        { name: 'abc', relationship: 'Department colleague' },
        { name: 'pqr', relationship: 'Department colleague' },
        // ... more followers
    ];

    return (
        <div className="card">
            <div className="card-header">
                Who to follow
            </div>
            <ul className="list-group list-group-flush">
                {followers.map((follower, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            {follower.name}
                            <p className="text-muted small">{follower.relationship}</p>
                        </div>
                        <button className="btn btn-sm btn-primary">Follow</button>
                    </li>
                ))}
            </ul>
            <div className="card-footer">
                <a href="#">View all related researchers</a>
            </div>
        </div>
    );
};

export default FollowList;