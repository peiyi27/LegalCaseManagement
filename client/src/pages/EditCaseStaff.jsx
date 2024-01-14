// EditCase.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './EditCaseStaff.css';

const EditCaseStaff = () => {
  const [formData, setFormData] = useState({
    caseName: '',
    caseType: '',
    caseStatus: '',
    staffName: '',
    client: '',
    caseDetails: '',
  });

  const { caseId } = useParams();
  const navigate = useNavigate();

  const [staffNames, setStaffNames] = useState([]);
  const [clientNames, setClientNames] = useState([]);

  useEffect(() => {
    // Fetch case details by caseId
    axios.get(`http://localhost:3001/get-case-details/${caseId}`)
      .then(response => {
        console.log('Case Details:', response.data.caseData);
        const caseDetails = response.data.caseData;
        setFormData({
          caseName: caseDetails.case_name || '',
          caseType: caseDetails.case_type || '',
          caseStatus: caseDetails.case_status || '',
          staffName: caseDetails.staff_name || '',
          client: caseDetails.client_name || '',
          caseDetails: caseDetails.case_detail || '',
        });
      })
      .catch(error => console.error('Error fetching case details:', error));

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
  }, [caseId]);

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

  // Define handleChange function
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form Data:', formData); // Log the form data for debugging purposes

    // Make an AJAX request to update the case details
    try {
      const response = await axios.post(`http://localhost:3001/edit-case/${caseId}`, formData);
      if (response.data.success) {
        // Display a success message
        Swal.fire({
          icon: 'success',
          title: 'Case Updated',
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          // Redirect or perform any other action after success
          navigate('/CaseManagementStaff');
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

  const handleBackClick = (caseId) => {
    navigate(`/CaseManagementStaff`);
    // Handle Edit button click, you can navigate to an edit page or perform any action
  };

  return (
    <Form className="staff-edit-case-form" onSubmit={handleSubmit}>
        <button  onClick={handleBackClick}>
          Back
        </button>
      <h2>Edit Case</h2>
        <Form.Group controlId="caseName">
          <Form.Label>Case Name</Form.Label>
          <Form.Control type="text" placeholder="Enter case name" onChange={handleChange} value={formData.caseName} />
        </Form.Group>

        <Form.Group controlId="caseType">
          <Form.Label>Case Type</Form.Label>
          <Form.Control as="select" onChange={handleChange} value={formData.caseType} required>
          <option value="" disabled>Select case type</option>
            <option value="Civil Cases">Civil Cases</option>
            <option value="Criminal Cases">Criminal Cases</option>
            <option value="Administrative Cases">Administrative Cases</option>
            <option value="Immigration Cases">Immigration Cases</option>
            <option value="Commercial Cases">Commercial Cases</option>
            <option value="Environmental Cases">Environmental Cases</option>
            <option value="Family Law Cases">Family Law Cases</option>
            <option value="Probate Cases">Probate Cases</option>
            <option value="Constitutional Cases">Constitutional Cases</option>
            <option value="Labor and Employment Cases">Labor and Employment Cases</option>
            <option value="Real Estate Cases">Real Estate Cases</option>
            <option value="Bankruptcy Cases">Bankruptcy Cases</option>
            <option value="Intellectual Property Cases">Intellectual Property Cases</option>
            {/* Add more options as needed */}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="caseStatus">
          <Form.Label>Case Status</Form.Label>
          <Form.Control as="select" onChange={handleChange} value={formData.caseStatus} required>
          <option value="" disabled>Select case status</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
            <option value="Settled">Settled</option>
            <option value="Dismissed">Dismissed</option>
            <option value="Adjudicated">Adjudicated</option>
            <option value="Appealed">Appealed</option>
            <option value="In Review">In Review</option>
            <option value="In Mediation/Arbitration">In Mediation/Arbitration</option>
            <option value="Warrant Issued">Warrant Issued</option>
            {/* Add more options as needed */}
            {/* Add more options as needed */}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="staffName">
          <Form.Label>Staff Name</Form.Label>
          <Form.Control as="select" onChange={handleChange} value={formData.staffName} required>
            <option value="" disabled>Select staff name</option>
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

        <Form.Group controlId="caseDetails">
          <Form.Label>Case Details</Form.Label>
          <Form.Control as="textarea" rows={3} onChange={handleChange} value={formData.caseDetails} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Case
        </Button>
      </Form>
  );
};

export default EditCaseStaff;
