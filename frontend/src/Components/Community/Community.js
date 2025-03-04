// src/components/CommunityPage.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import CommunityList from './CommunityList';
import CommunityForm from './CommunityForm';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../Home/Footer';
import ModeratorDashboard from './ModeratorDashboard';

function Community() {
    const [activeTab, setActiveTab] = useState('list');
    const [isStudent, setIsStudent] = useState(true); // Add state for user role

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:3001/get-user-role', { withCredentials: true });
                const buffer = response.data.isStudent;
                if (buffer && buffer.data && buffer.data.length > 0) {
                    setIsStudent(buffer.data[0] === 1); // Convert Buffer to boolean
                }else{
                    setIsStudent(false); //default to false if the buffer is empty or null.
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        fetchUserRole();
    }, []);

    return (
        <>
            <Container className='vh-100'>
                <Row>
                    <Col>
                        <Tabs className="mt-2" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                            <Tab eventKey="list" title="Communities">
                                <CommunityList />
                            </Tab>
                            {!isStudent && ( // Conditionally render the "Create Community" tab
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

            </Container>
            <Footer />
        </>
    );
}

export default Community;