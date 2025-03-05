import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ModeratorDashboard() {
    const [communities, setCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [members, setMembers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [posts, setPosts] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3001/moderator/communities', { withCredentials: true })
            .then((res) => {
                if (res.data) {
                    setCommunities(res.data);
                    if (res.data.length > 0) {
                        setSelectedCommunity(res.data[0].community_id);
                    }
                } else {
                    setCommunities([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching communities:", error);
            });
    }, []);

    useEffect(() => {
        if (selectedCommunity) {
            // axios.get(`http://localhost:3001/community/${selectedCommunity}/posts`, { withCredentials: true })
            //     .then((res) => {
            //         if (res.data) {
            //             setPosts(res.data);
            //         } else {
            //             setPosts([]);
            //         }
            //     })
            //     .catch((error) => {
            //         console.error("Error fetching posts:", error);
            //         setPosts([]);
            //     });

            axios.get(`http://localhost:3001/community/${selectedCommunity}/members`, { withCredentials: true })
                .then((res) => {
                    if (res.data) {
                        setMembers(res.data.members);
                        setRequests(res.data.requests);
                    } else {
                        setMembers([]);
                        setRequests([]);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching members:", error);
                    setMembers([]);
                    setRequests([]);
                });
        }
    }, [selectedCommunity,members]);

    const handleCommunityChange = (e) => {
        setSelectedCommunity(e.target.value);
    };

    const handleApproveMember = async (memberId) => {
        try {
            await axios.post('http://localhost:3001/approve-request', { userId: memberId, communityId: selectedCommunity }, { withCredentials: true });
            setMembers([...members, requests.find(request => request.user_id === memberId)]);
            setRequests(requests.filter(request => request.user_id !== memberId));

            const community = communities.find(community => community.community_id == selectedCommunity);

            await axios.post('http://localhost:3001/store-notification', {
                id: Date.now(),
                senderId: community.moderator_id,
                receiverId: memberId,
                content: ` Your join request of <b>${community.community_name}</b> community was approved.`,  // Insert the evaluated action
            }, {
                withCredentials: true
            });

        } catch (error) {
            console.error('Error approving member:', error);
        }
    };

    const handleRejectMember = async (memberId) => {
        try {
            await axios.delete('http://localhost:3001/reject-request', { data: { userId: memberId, communityId: selectedCommunity }, withCredentials: true });
            setRequests(requests.filter(request => request.user_id !== memberId));

            const community = communities.find(community => community.community_id == selectedCommunity);

            await axios.post('http://localhost:3001/store-notification', {
                id: Date.now(),
                senderId: community.moderator_id,
                receiverId: memberId,
                content: ` Your join request of <b>${community.community_name}</b> community was rejected.`,  // Insert the evaluated action
            }, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Error rejecting member:', error);
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            const userId = memberId;
            const communityId = selectedCommunity;
            await axios.post('http://localhost:3001/remove-member', { userId,communityId }, { withCredentials: true });
            setMembers(members.filter(member => member.user_id !== memberId));

            const community = communities.find(community => community.community_id == selectedCommunity);

            await axios.post('http://localhost:3001/store-notification', {
                id: Date.now(),
                senderId: community.moderator_id,
                receiverId: memberId,
                content: ` You were removed from <b>${community.community_name}</b> community.`,  // Insert the evaluated action
            }, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    const handleApprovePost = async (postId) => {
        // Implement approve post logic
        console.log(`Approving post ${postId}`);
    };

    const handleRejectPost = async (postId) => {
        // Implement reject post logic
        console.log(`Rejecting post ${postId}`);
    };

    const handleDeleteCommunity = async (selectedCommunity) => {
        try {
            await axios.delete(`http://localhost:3001/delete-community/${selectedCommunity}`, { withCredentials: true });

            setCommunities(communities.filter(community => community.community_id !== selectedCommunity));
            setSelectedCommunity(null);
        } catch (error) {
            console.error('Error deleting community:', error);
        }
    }

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = (selectedCommunity) => {
        handleDeleteCommunity(selectedCommunity);
        setShowDeleteConfirmation(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <div className="moderator-dashboard">
            {communities.length === 0 ? (
                <div className="text-center mt-5">
                    <h5>No communities found!</h5>
                    <p>Please create a community first.</p>
                </div>
            ) : (
                <>
                    <div className="mb-4 mt-2">
                        <Form.Group controlId="communitySelect">
                            <h5>Select Community</h5>
                            <Form.Control as="select" value={selectedCommunity || ''} onChange={handleCommunityChange}>
                                {communities.map((community) => (
                                    <option key={community.community_id} value={community.community_id}>
                                        {community.community_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {selectedCommunity && (
                            <Button
                                variant="danger"
                                className="mt-2"
                                onClick={() => handleDeleteClick(selectedCommunity)}
                            >
                                Delete Community
                            </Button>
                        )}
                    </div>

                    {selectedCommunity && (
                        <div>
                            <h5 className='mb-3'>Manage Members</h5>
                            <h6>Join Requests</h6>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th style={{ width: '33.33%' }}>Name</th>
                                        <th style={{ width: '33.33%' }}>Email</th>
                                        <th style={{ width: '33.33%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => (
                                        <tr key={request.user_id}>
                                            <td>
                                                <Link to={`/view-profile/${request.user_id}`} style={{ color: 'black' }}>
                                                    {request.full_name}
                                                </Link>
                                            </td>
                                            <td>{request.email}</td>
                                            <td>
                                                <Button variant="success" onClick={() => handleApproveMember(request.user_id)}>
                                                    Approve
                                                </Button>{' '}
                                                <Button variant="danger" onClick={() => handleRejectMember(request.user_id)}>
                                                    Reject
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <h6>Already Joined Members</h6>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th style={{ width: '33.33%' }}>Name</th>
                                        <th style={{ width: '33.33%' }}>Email</th>
                                        <th style={{ width: '33.33%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <tr key={member.user_id}>
                                            <td>
                                                <Link to={`/view-profile/${member.user_id}`} style={{ color: 'black' }}>
                                                    {member.full_name}
                                                </Link>
                                            </td>
                                            <td>{member.email}</td>
                                            <td>
                                                <Button variant="danger" onClick={() => handleRemoveMember(member.user_id)}>
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <h5 className='mt-3'>Manage Posts</h5>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th style={{ width: '33.33%' }}>Title</th>
                                        <th style={{ width: '33.33%' }}>Content</th>
                                        <th style={{ width: '33.33%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {posts.map((post) => (
                                <tr key={post.post_id}>
                                    <td>{post.title}</td>
                                    <td>{post.content}</td>
                                    <td>
                                        <Button variant="success" onClick={() => handleApprovePost(post.post_id)}>
                                            Approve
                                        </Button>{' '}
                                        <Button variant="danger" onClick={() => handleRejectPost(post.post_id)}>
                                            Reject
                                        </Button>
                                    </td>
                                </tr>
                            ))} */}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {showDeleteConfirmation && (
                        <div className="modal d-flex align-items-center justify-content-center" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirm Delete</h5>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to delete this community?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>No</button>
                                        <button type="button" className="btn btn-danger" onClick={() => handleConfirmDelete(selectedCommunity)}>Yes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}

export default ModeratorDashboard;