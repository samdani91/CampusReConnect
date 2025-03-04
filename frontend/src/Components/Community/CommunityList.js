import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

function CommunityList() {
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);

  useEffect(() => {
    fetchCommunities();
    fetchUserCommunities();
  }, [communities,userCommunities]);

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


  const handleJoin = async (communityId) => {
    try {
      await axios.post('http://localhost:3001/join-community', { communityId }, { withCredentials: true });
      setUserCommunities([...userCommunities, communityId]); 
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeave = async (communityId) => {
    try {
      await axios.post('http://localhost:3001/leave-community', { communityId }, { withCredentials: true });
      setUserCommunities(userCommunities.filter(id => id !== communityId)); 
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  return (
    <Table striped bordered hover>
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
            <td>{community.community_name}</td>
            <td style={{whiteSpace: 'pre-line'}}>{community.community_description}</td>
            <td>
              {userCommunities.includes(community.community_id) ? (
                <Button variant="danger" style={{ width: '80px' }} onClick={() => handleLeave(community.community_id)}>
                  Leave
                </Button>
              ) : (
                <Button variant="primary" style={{ width: '80px' }} onClick={() => handleJoin(community.community_id)}>
                  Join
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default CommunityList;
