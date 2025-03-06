// src/components/CommunityPage.js
import React, { useState, useEffect } from 'react';
import CommunityList from './CommunityList';
import CommunityForm from './CommunityForm';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../Home/Footer';
import ModeratorDashboard from './ModeratorDashboard';

function Community() {
    const [activeTab, setActiveTab] = useState('list');
    const [isStudent, setIsStudent] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:3001/get-user-role', { withCredentials: true });
                const buffer = response.data.isStudent;
                if (buffer && buffer.data && buffer.data.length > 0) {
                    setIsStudent(buffer.data[0] === 1);
                } else {
                    setIsStudent(false);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        fetchUserRole();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> {/* Added flex container */}
            <Container className="mt-4" style={{ flexGrow: 1 }}> {/* Added flexGrow */}
                <div className='card w-100 p-4'>
                    <Row className="text-center mb-4">
                        <Col>
                            <h1>Welcome to Community</h1>
                            <p>Join or create communities and share your thoughts.</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Tabs className="mt-2" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                <Tab eventKey="list" title="Communities">
                                    <CommunityList />
                                </Tab>
                                {!isStudent && (
                                    <Tab eventKey="create" title="Create Community">
                                        <CommunityForm />
                                    </Tab>
                                )}
                                {!isStudent && (
                                    <Tab eventKey="moderator" title="Moderator Dashboard">
                                        <ModeratorDashboard />
                                    </Tab>
                                )}
                            </Tabs>
                        </Col>
                    </Row>
                </div>
            </Container>
            <Footer />
        </div>
    );
}

export default Community;