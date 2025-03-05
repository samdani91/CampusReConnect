import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function CommunityList() {
    const navigate = useNavigate();
    const [communities, setCommunities] = useState([]);
    const [userCommunities, setUserCommunities] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
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
        fetchPendingRequests(); // Fetch pending request IDs
    }, [communities]);

    const fetchCommunities = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-communities', { withCredentials: true });
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

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-pending-requests', { withCredentials: true });
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    const handleRequestJoin = async (communityId) => {
        try {
            await axios.post('http://localhost:3001/request-join', { communityId }, { withCredentials: true });
            setPendingRequests([...pendingRequests, communityId]); // Add to pending list
        } catch (error) {
            console.error('Error requesting join:', error);
        }
    };

    const handleCancelRequest = async (communityId) => {
        try {
            await axios.delete('http://localhost:3001/cancel-request', { data: { communityId }, withCredentials: true });
            setPendingRequests(pendingRequests.filter(id => id !== communityId)); // Remove from pending list
        } catch (error) {
            console.error('Error cancelling request:', error);
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
            // User is not a member, show the modal
            // setSelectedCommunity(community);
            setShowJoinModal(true)
        }
    };

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
                                {userCommunities.includes(community.community_id) ? (
                                    community.moderator_id === currentUserId ? (
                                        <Button variant="success" style={{ width: '120px' }} disabled>
                                            Joined
                                        </Button>
                                    ) : (
                                        <Button variant="danger" style={{ width: '120px' }} onClick={() => handleLeaveCommunity(community.community_id)}>
                                            Leave
                                        </Button>
                                    )
                                ) : pendingRequests.includes(community.community_id) ? (
                                    <Button variant="warning" style={{ width: '120px' }} onClick={() => handleCancelRequest(community.community_id)}>
                                        Cancel Request
                                    </Button>
                                ) : (
                                    <Button variant="primary" style={{ width: '120px' }} onClick={() => handleRequestJoin(community.community_id)}>
                                        Join Request
                                    </Button>
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

export default CommunityList;