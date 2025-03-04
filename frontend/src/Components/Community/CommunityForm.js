import React, { useState,useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

function CommunityForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let timeoutId;
    if (message) {
      timeoutId = setTimeout(() => {
        setMessage(null);
      }, 1500); // 1.5 seconds
    }

    return () => clearTimeout(timeoutId); // Clear the timeout on unmount or when message changes
  }, [message]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3001/create-community', {
            community_name: name,
            community_description: description,
          }, { withCredentials: true });
    
        
        setName(''); // Clear the form fields
        setDescription('');
        setMessage({ type: 'success', text: response.data.message });
      } catch (error) {
        console.error('Error creating community:', error);
        setMessage({ type: 'error', text: error.response.data.message });
      }
  };

  return (
    <Form className="mt-3" onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Community Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label className='mt-2'>Description</Form.Label>
        <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Form.Group>
      <Button variant="primary" type="submit" className='my-3'>
        Create Community
      </Button>
      {message && ( // Conditionally render the message
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mt-3`} role="alert">
          {message.text}
        </div>
      )}
    </Form>
  );
}

export default CommunityForm;