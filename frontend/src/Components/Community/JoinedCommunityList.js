import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JoinedCommunityList() {
    const navigate = useNavigate();
    const [communities, setCommunities] = useState([]);
    const [userCommunities, setUserCommunities] = useState([]);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

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
    }, []);

    useEffect(() => {
        fetchCommunities();
        fetchUserCommunities();
    }, [communities]);

    const fetchCommunities = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-joined-communities', { withCredentials: true });
            setCommunities(response.data);
        } catch (error) {
            console.error('Error fetching communities:', error);
        }
    };

    const fetchUserCommunities = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-user-communities', { withCredentials: true });
            setUserCommunities(response.data.map(community => community.community_id));
        } catch (error) {
            console.error('Error fetching user communities:', error);
        }
    };


    const handleLeaveCommunity = async (communityId) => {
        try {
            await axios.post('http://localhost:3001/leave-community', { communityId }, { withCredentials: true });
            setUserCommunities(userCommunities.filter(id => id !== communityId));
        } catch (error) {
            console.error('Error leaving community:', error);
        }
    }
    const handleCommunityClick = (community) => {
        if (userCommunities.includes(community.community_id)) {
            navigate(`/community/${community.community_id}/feed`)
        } else {
            // setSelectedCommunity(community);
            setShowJoinModal(true)
        }
    };

    if (communities.length === 0) {
        return <p className="mt-4 text-center">Please join a community first.</p>;
    }

    return (
        <>
            <Table striped bordered hover className='mt-2'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {communities.map((community) => (
                        <tr key={community.community_id}>
                            <td>
                                <a style={{ color: 'black', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleCommunityClick(community)}> {/* Link to Community Feed */}
                                    {community.community_name}
                                </a>
                            </td>
                            <td style={{ whiteSpace: 'pre-line' }}>{community.community_description}</td>
                            <td>
                                {userCommunities.includes(community.community_id) && ( // Only render if user has joined
                                    community.moderator_id === currentUserId ? (
                                        <Button variant="success" style={{ width: '120px' }} disabled>
                                            Joined
                                        </Button>
                                    ) : (
                                        <Button variant="danger" style={{ width: '120px' }} onClick={() => handleLeaveCommunity(community.community_id)}>
                                            Leave
                                        </Button>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {showJoinModal && (
                <div className="modal d-flex align-items-center justify-content-center" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Join Community</h5>
                            </div>
                            <div className="modal-body">
                                <p>Please join the community.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => setShowJoinModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </>
    );
}

export default JoinedCommunityList;