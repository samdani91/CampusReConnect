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
    const [showLeaveModal, setShowLeaveModal] = useState(false); 
    const [selectedCommunity, setSelectedCommunity] = useState(null); 
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
        fetchPendingRequests();
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
            setPendingRequests([...pendingRequests, communityId]);
        } catch (error) {
            console.error('Error requesting join:', error);
        }
    };

    const handleCancelRequest = async (communityId) => {
        try {
            await axios.delete('http://localhost:3001/cancel-request', { data: { communityId }, withCredentials: true });
            setPendingRequests(pendingRequests.filter(id => id !== communityId));
        } catch (error) {
            console.error('Error cancelling request:', error);
        }
    };

    const handleLeaveCommunity = async () => {
        if (!selectedCommunity) return;

        try {
            await axios.post('http://localhost:3001/leave-community', { communityId: selectedCommunity.community_id }, { withCredentials: true });
            setUserCommunities(userCommunities.filter(id => id !== selectedCommunity.community_id));
            setShowLeaveModal(false); 
        } catch (error) {
            console.error('Error leaving community:', error);
        }
    };

    const handleCommunityClick = (community) => {
        if (userCommunities.includes(community.community_id)) {
            navigate(`/community/${community.community_id}/feed`);
        } else {
            setShowJoinModal(true);
        }
    };

    const openLeaveModal = (community) => {
        setSelectedCommunity(community);
        setShowLeaveModal(true); 
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
                                        <Button variant="danger" style={{ width: '120px' }} onClick={() => openLeaveModal(community)}>
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

            {showLeaveModal && (
                <div className="modal d-flex align-items-center justify-content-center" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Are you sure you want to leave this community?</h5>
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={() => setShowLeaveModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleLeaveCommunity}>
                                    Leave
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CommunityList;
