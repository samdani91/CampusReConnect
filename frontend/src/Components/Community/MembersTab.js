import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'react-bootstrap';

function MembersTab({ moderatorId }) {
    const { communityId } = useParams();
    const [members, setMembers] = useState([]); // Initialize as an empty array
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/community/${communityId}/member`, { withCredentials: true });
                setMembers(response.data.members);
            } catch (error) {
                console.error('Error fetching members:', error);
                setMembers([]);
            } finally {
                setIsLoading(false); // Set loading to false after fetching data
            }
        };

        fetchMembers();
    }, [communityId]);

    if (isLoading) {
        return <div>Loading members...</div>; // Show loading message
    }

    return (
        <div>
            {members && members.length > 0 ? ( // Check if members is an array and not empty
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.user_id} className='bg-danger'>
                                <td>
                                    <Link to={`/view-profile/${member.user_id}`} style={{ color: 'black' }}>
                                        {member.full_name}
                                    </Link>
                                </td>
                                <td>{member.department}</td>
                                <td>{member.is_student.data[0] ? 'Student' : 'Faculty'}</td>
                                <td>
                                    {member.user_id === moderatorId ? 'Moderator' : 'Member'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p className='text-center'>No members found.</p>
            )}
        </div>
    );
}

export default MembersTab;