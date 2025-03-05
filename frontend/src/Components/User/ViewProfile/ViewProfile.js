import React, { useState, useEffect, useContext } from "react";
import { useParams,useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import ProfileTab from "./ProfileTab";
import ResearchTab from "./ResearchTab";
import StatsTab from "./StatsTab";
import Footer from '../../Home/Footer';
import "./style.css";

const ViewProfile = () => {
    const { userId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Profile");
    const [userData, setUserData] = useState({ full_name: "Loading...", degree: "Loading..." });
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserName, setCurrentUserName] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get("tab");

        if (tab) {
            setActiveTab(tab); // Set the active tab based on the query parameter
        }
    }, [location]);

    useEffect(() => {
        if (currentUser && userId) {
            axios.get(`http://localhost:3001/is-following/${userId}`, { withCredentials: true })
                .then(response => setIsFollowing(response.data.isFollowing))
                .catch(error => console.error("Error checking follow status:", error));
        }
    }, [currentUser, userId]);

    useEffect(() => {
        const fetchFollowersData = async () => {
            try {
                const followersResponse = await axios.get(`http://localhost:3001/get-followers/${userId}`, {
                    withCredentials: true,
                });
                const followingResponse = await axios.get(`http://localhost:3001/get-following/${userId}`, {
                    withCredentials: true,
                });
                const followersCountResponse = await axios.get(`http://localhost:3001/followers/count/${userId}`);
                const followingCountResponse = await axios.get(`http://localhost:3001/following/count/${userId}`);

                setFollowers(followersResponse.data);
                setFollowing(followingResponse.data);
                setFollowersCount(followersCountResponse.data.count);
                setFollowingCount(followingCountResponse.data.count);
            } catch (error) {
                console.error("Error fetching followers data:", error);
            }
        };
        fetchFollowersData();
    }, [userId, isFollowing, followers, following, followersCount, followingCount]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("http://localhost:3001/get-userId", {
                    withCredentials: true,
                });
                setCurrentUser(response.data);
                const response2 = await axios.get("http://localhost:3001/get-profile", {
                    withCredentials: true,
                });
                setCurrentUserName(response2.data);
                // console.log(response2.data)
            } catch (error) {
                console.error("Error fetching current user data:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/get-headerData/${userId}`, {
                    withCredentials: true,
                });
                setUserData(response.data);
                // console.log(userData)
            } catch (error) {
                // console.error("Error fetching user data:", error);
                setUserData({ full_name: "Error", degree: "Error" });
            }
        };

        fetchUserData();
    }, [userId]);

    const handleFollowersClick = () => {
        setIsFollowersModalOpen(true);
    };

    const handleFollwingClick = () => {
        setIsFollowingModalOpen(true);
    }

    const handleRemoveFollowing = async (followeeId) => {
        try {
            await axios.delete(`http://localhost:3001/unfollow/${followeeId}`, {
                withCredentials: true,
            });
        } catch (error) {
            console.error("Error unfollowing:", error);
        }
    };

    const seeProfile = async (profileId) => {
        navigate(`/view-profile/${profileId}`);
        handleCloseModal();
    }

    const handleFollowClick = async () => {
        try {
            if (isFollowing) {
                await axios.delete(`http://localhost:3001/unfollow/${userId}`, {
                    withCredentials: true,
                });
                setIsFollowing(false);
            } else {
                await axios.post(`http://localhost:3001/follow/${userId}`, {}, {
                    withCredentials: true,
                });
                setIsFollowing(true);

                const name = currentUserName.full_name;
                

                await axios.post('http://localhost:3001/store-notification', {
                    id: Date.now(),
                    senderId: currentUser.user_id,
                    receiverId: userId,
                    content: `${name} started following you.`
                },{
                    withCredentials:true
                });
            }
        } catch (error) {
            console.error(isFollowing ? "Error unfollowing:" : "Error following:", error);
        }
    };

    const handleCloseModal = () => {
        setIsFollowersModalOpen(false);
        setIsFollowingModalOpen(false)
    };

    const isOwnProfile = currentUser && currentUser.user_id === userId;

    const renderTabContent = () => {
        switch (activeTab) {
            case "Profile":
                return <ProfileTab isOwnProfile={isOwnProfile} userId={userId} />;
            case "Research":
                return <ResearchTab isOwnProfile={isOwnProfile} userId={userId} />;
            case "Stats":
                return <StatsTab userId={userId} />;
            default:
                return <ProfileTab isOwnProfile={isOwnProfile} userId={userId} />;
        }
    };



    return (
        <>
            <div className="container profile-container">
                <div className="profile-card card ">
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center h-100 mt-2">
                                <div
                                    className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        fontSize: "25px",
                                    }}
                                >
                                    {userData.full_name.charAt(0)}
                                </div>
                                <div className="ms-4">
                                    <h4 className="fw-bold mb-1">{userData.full_name}</h4>
                                    <p className="mb-1 text-muted">
                                        {userData.degree || "Degree"} · <span className="text-primary">University of Dhaka</span>
                                    </p>
                                    <p className="text-muted small">
                                        Bangladesh
                                    </p>
                                </div>
                            </div>
                            <div className="text-end mt-2">
                                <div>
                                    <p className="mb-0 text-muted small">Research Interest Score ----- <span>0</span></p>
                                </div>
                                <div>
                                    <p className="mb-0 text-muted small">Citations ----- <span>0</span></p>
                                </div>

                                <div className="d-flex mt-3 mb-5">
                                    <div className="me-4" style={{ cursor: 'pointer' }} onClick={handleFollowersClick}>
                                        <span><span className="fw-bold p-1">{followersCount}</span> Followers</span>
                                    </div>
                                    <div style={{ cursor: 'pointer' }} onClick={handleFollwingClick}>
                                        <span><span className="fw-bold p-1">{followingCount}</span> Following</span>
                                    </div>
                                </div>

                                {!isOwnProfile && (
                                    <button className="btn btn-primary" onClick={handleFollowClick}>
                                        {isFollowing ? "Following" : "Follow"}
                                    </button>
                                )}

                            </div>
                        </div>
                    </div>
                    <ul className="nav nav-tabs mt-3 px-3">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "Profile" ? "active" : ""}`}
                                onClick={() => setActiveTab("Profile")}
                            >
                                Profile
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "Research" ? "active" : ""}`}
                                onClick={() => setActiveTab("Research")}
                            >
                                Research
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "Stats" ? "active" : ""}`}
                                onClick={() => setActiveTab("Stats")}
                            >
                                Stats
                            </button>
                        </li>
                    </ul>
                    <div className="p-3">{renderTabContent()}</div>
                </div>
            </div>

            {/* Followers Modal */}
            {isFollowersModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Followers</h4>
                        <ul className="list-unstyled">
                            {followers.map((follower) => (
                                <li key={follower.user_id} className="d-flex justify-content-between align-items-center border-bottom">
                                    <span
                                        onClick={() => { seeProfile(follower.user_id) }}
                                        className="text-decoration-none p-2 rounded fs-5" // Add padding and rounded corners
                                        style={{
                                            transition: 'background-color 0.3s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} // Change background on hover
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'} // Reset background on mouse leave
                                    >
                                        {follower.full_name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}

            {isFollowingModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Following</h4>
                        <ul className="list-unstyled ">
                            {following.map((followings) => (
                                <li key={followings.user_id} className="d-flex justify-content-between align-items-center border-bottom">
                                    <span
                                        onClick={() => { seeProfile(followings.user_id)}}
                                        className="text-decoration-none p-2 rounded fs-5 " // Add padding and rounded corners
                                        style={{
                                            transition: 'background-color 0.3s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} // Change background on hover
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'} // Reset background on mouse leave
                                    >
                                        {followings.full_name}
                                    </span>
                                    <button className="btn btn-danger " onClick={() => handleRemoveFollowing(followings.user_id)}>Remove</button>
                                </li>
                                
                            ))}
                        </ul>
                        <button className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}


            <Footer />
        </>
    );
};

export default ViewProfile;
