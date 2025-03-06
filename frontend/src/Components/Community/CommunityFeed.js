import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MembersTab from './MembersTab';
import PostTab from './PostTab';
import Footer from '../Home/Footer';

function CommunityFeed() {
    const { communityId } = useParams();
    const [community, setCommunity] = useState(null);
    const [activeTab, setActiveTab] = useState('discussion'); // Default to 'discussion' tab
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
        const fetchCommunityDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/community/${communityId}`, { withCredentials: true });
                setCommunity(response.data);
            } catch (error) {
                console.error('Error fetching community details:', error);
            }
        };

        fetchCommunityDetails();
    }, [communityId]);

    if (!community) {
        return <div>Loading...</div>;
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>

            <div className="container-lg mt-4 vh-100">
                <div className="card p-4 w-100">
                    <div className="card-title">
                        <h2>{community.community_name}</h2>
                    </div>
                    <div className="card-text" style={{ whiteSpace: 'pre-line' }}>
                        {community.community_description}
                    </div>

                    <div className="mt-3">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'discussion' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('discussion')}
                                >
                                    Discussion
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'members' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('members')}
                                >
                                    Members
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'yourPosts' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('yourPosts')}
                                >
                                    Your Posts
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Render content based on activeTab */}
                    <div className="mt-3">
                        {activeTab === 'discussion' && <div>{/* Discussion content */}</div>}
                        {activeTab === 'members' && <MembersTab moderatorId={community.moderator_id} />}
                        {activeTab === 'yourPosts' && <PostTab userId={currentUserId} communityId={communityId}/>}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}

export default CommunityFeed;