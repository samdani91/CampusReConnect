import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileTab from "./ProfileTab";
import ResearchTab from "./ResearchTab";
import StatsTab from "./StatsTab";
import Footer from '../../Home/Footer';
import "./style.css";

const ViewProfile = () => {
    const { userId } = useParams();
    const [activeTab, setActiveTab] = useState("Profile");
    const [userData, setUserData] = useState({ full_name: "Loading...", degree: "Loading..." });
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("http://localhost:3001/get-userId", {
                    withCredentials: true,
                });
                setCurrentUser(response.data);
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
                console.log(userData)
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserData({ full_name: "Error", degree: "Error" });
            }
        };

        fetchUserData();
    }, [userId]);

    useEffect(() => {
        const fetchFollowersData = async () => {
            try {
                const followersResponse = await axios.get("http://localhost:3001/get-followers", {
                    withCredentials: true,
                });
                const followingResponse = await axios.get("http://localhost:3001/get-following", {
                    withCredentials: true,
                });

                setFollowers(followersResponse.data);
                setFollowing(followingResponse.data);
                setFollowersCount(followersResponse.data.length);
                setFollowingCount(followingResponse.data.length);
            } catch (error) {
                console.error("Error fetching followers data:", error);
            }
        };

        fetchFollowersData();
    }, []);

    const handleFollowersClick = () => {
        setIsFollowersModalOpen(true);
    };

    const handleRemoveFollower = () => {

    }

    const handleFollowClick = () => {
        // Implement follow logic here
        console.log("Follow button clicked");
    };

    const handleCloseModal = () => {
        setIsFollowersModalOpen(false);
    };

    const isOwnProfile = currentUser && currentUser.user_id === userId;

    const renderTabContent = () => {
        switch (activeTab) {
            case "Profile":
                return <ProfileTab isOwnProfile={isOwnProfile} userId={userId}/>;
            case "Research":
                return <ResearchTab isOwnProfile={isOwnProfile} userId={userId}/>;
            case "Stats":
                return <StatsTab userId={userId}/>;
            default:
                return <ProfileTab isOwnProfile={isOwnProfile} userId={userId}/>;
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
                                    <div style={{ cursor: 'pointer' }}>
                                        <span><span className="fw-bold p-1">{followingCount}</span> Following</span>
                                    </div>
                                </div>

                                {!isOwnProfile && (
                                    <button className="btn btn-primary" onClick={handleFollowClick}>
                                        Follow
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
            {/* {isFollowersModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h5>Followers</h5>
                        <ul>
                            {followers.map((follower) => (
                                <li key={follower.id}>
                                    {follower.name} <button onClick={() => handleRemoveFollower(follower.id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )} */}

            <Footer />
        </>
    );
};

export default ViewProfile;
