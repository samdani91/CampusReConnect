import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FollowList = () => {
  const [users, setUsers] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/active-user-list', { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:3001/get-userId", { withCredentials: true });
        setCurrentUser(response.data);
        const response2 = await axios.get("http://localhost:3001/get-profile", { withCredentials: true });
        setCurrentUserName(response2.data);
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchFollowStatus = async () => {
        const status = {};
        for (const user of users) {
          try {
            const response = await axios.get(`http://localhost:3001/is-following/${user.user_id}`, { withCredentials: true });
            status[user.user_id] = response.data.isFollowing;
          } catch (error) {
            console.error("Error checking follow status:", error);
          }
        }
        setFollowStatus(status);
      };
      fetchFollowStatus();
    }
  }, [currentUser, users]);

  const handleViewAllResearchers = () => {
    navigate('/all-researchers');
  };

  const handleFollowClick = async (userId) => {
    try {
      const isFollowing = followStatus[userId];

      if (isFollowing) {
        await axios.delete(`http://localhost:3001/unfollow/${userId}`, { withCredentials: true });
      } else {
        await axios.post(`http://localhost:3001/follow/${userId}`, {}, { withCredentials: true });

        const name = currentUserName.full_name;

        await axios.post('http://localhost:3001/store-notification', {
          id: Date.now(),
          senderId: currentUser.user_id,
          receiverId: userId,
          content: `${name} started following you.`,
        }, { withCredentials: true });
      }

      // Refresh the user list to update the button state
      const response = await axios.get('http://localhost:3001/active-user-list', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getInitials = (fullName) => {
    const nameArray = fullName.split(" ");
    const initials = nameArray.map(name => name.charAt(0).toUpperCase()).join('');
    return initials;
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0">
        <div className="card-header p-4 text-white" style={{backgroundColor:"#051129"}}>
          <h5 className="mb-0">Who to follow</h5>
        </div>
        <ul className="list-group list-group-flush">
          {users && Array.isArray(users) && users.slice(0, 5).map((user) => (
            currentUser && user.user_id !== currentUser.user_id && (
              <li key={user.user_id} className="list-group-item  p-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {/* Display first letter(s) as the avatar */}
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center me-2"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'gray', // Set background color for the avatar
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '18px',
                    }}
                  >
                    {getInitials(user.full_name)}
                  </div>
                  <div>
                    <Link to={`/view-profile/${user.user_id}`} className="text-dark fw-bold">
                      {user.full_name}
                    </Link>
                    <p className="text-muted small mb-0">{user.department}</p>
                  </div>
                </div>
                <button
                  className={`btn ${followStatus[user.user_id] ? 'btn-success' : 'btn-primary'} w-25`}
                  onClick={() => handleFollowClick(user.user_id)}
                >
                  {followStatus[user.user_id] ? 'Following' : 'Follow'}
                </button>
              </li>
            )
          ))}
        </ul>
        <div className="card-footer text-center">
          <button onClick={handleViewAllResearchers} className="btn btn-link">
            View all researchers
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowList;
