import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Container, Row, Col, Card } from 'react-bootstrap';
import Footer from './Footer';

const AllResearchers = () => {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/active-user-list', { withCredentials: true });
                setAllUsers(response.data);
            } catch (error) {
                console.error('Error fetching all users:', error);
            }
        };
        fetchAllUsers();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Container className="mt-5 vh-100" style={{ flexGrow: 1 }}>
                <Row className="mb-4">
                    <Col>
                        <Card className="text-center p-4 shadow-sm w-100 text-white" style={{backgroundColor:"#051129"}}>
                            <Card.Body>
                                <Card.Title as="h2">All Researchers</Card.Title>
                                <Card.Text>CampusReConnect - Explore our researchers</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table striped bordered hover responsive className="shadow-sm">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th style={{ width: '30%' }}>Name</th>
                                    <th style={{ width: '30%' }}>Department</th>
                                    <th style={{ width: '40%' }}>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((user) => (
                                    <tr key={user.user_id}>
                                        <td>
                                            <Link to={`/view-profile/${user.user_id}`} style={{ color: 'black', fontWeight: 'bold' }}>
                                                {user.full_name}
                                            </Link>
                                        </td>
                                        <td>{user.department}</td>
                                        <td>{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default AllResearchers;
