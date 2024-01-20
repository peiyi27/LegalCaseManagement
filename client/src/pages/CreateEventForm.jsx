import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CreateEventForm.css';

const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDesc: '',
    staffName: '',
    client: '',
    eventDate: '',
    eventStart: '',
    eventEnd: '',
  });

  const navigate = useNavigate();

  const [staffNames, setStaffNames] = useState([]);
  const [clientNames, setClientNames] = useState([]);

  // Define handleChange function
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    // Fetch staff names
    axios.get('http://localhost:3001/get-staff-names')
      .then(response => {
        console.log('Staff Names:', response.data.staffNames);
        setStaffNames(response.data.staffNames);
      })
      .catch(error => console.error('Error fetching staff names:', error));

    // Fetch client names
    axios.get('http://localhost:3001/get-client-names')
      .then(response => {
        console.log('Client Names:', response.data.clientNames);
        setClientNames(response.data.clientNames);
      })
      .catch(error => console.error('Error fetching client names:', error));
  }, []);

  // Helper functions for rendering options
  const renderOptions = (data) => {
    return data.length > 0 ? (
      data.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))
    ) : (
      <option value="" disabled>Loading...</option>
    );
  };

  const renderStaffNameOptions = () => renderOptions(staffNames);
  const renderClientOptions = () => renderOptions(clientNames);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form Data:', formData); // Log the form data for debugging purposes

    try {
      const response = await axios.post('http://localhost:3001/create-event', formData);
      if (response.data.success) {
        // Display a success message
        Swal.fire({
          icon: 'success',
          title: 'Event Created',
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          // Redirect or perform any other action after success
          navigate('/CaseManagementAdmin');
        });
      } else {
        // Display an error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      // Handle AJAX error
      console.error('AJAX Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred.',
      });
    }
  };

  const handleBackClick = () => {
    
    navigate('/CaseManagementAdmin');
  };


  return (
    <Form className="admin-create-case-form" onSubmit={handleSubmit}>
    <button onClick={handleBackClick}>Back</button>
    <h2>Create New Case</h2>
        <Form.Group controlId="eventName">
          <Form.Label>Event Name</Form.Label>
          <Form.Control type="text" placeholder="Enter event name" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="eventDesc">
          <Form.Label>Event Details</Form.Label>
          <Form.Control type="text" placeholder="Enter event name" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="staffName">
          <Form.Label>Staff:</Form.Label>
          <Form.Control as="select" onChange={handleChange} value={formData.staffName} required>
            <option value="" disabled>Select staff</option>
            {renderStaffNameOptions()}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="client">
          <Form.Label>Client</Form.Label>
          <Form.Control as="select" onChange={handleChange} value={formData.client} required>
            <option value="" disabled>Select client</option>
            {renderClientOptions()}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="eventDate">
          <Form.Label>Event Date</Form.Label>
          <Form.Control type="date" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="eventStart">
          <Form.Label>Event Start Time</Form.Label>
          <Form.Control type="time" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="eventEnd">
          <Form.Label>Event End Time</Form.Label>
          <Form.Control type="time" onChange={handleChange} />
        </Form.Group>

    
        <Button variant="primary" type="submit">
          Create Event
        </Button>
      </Form>
  );
};

export default CreateEventForm;