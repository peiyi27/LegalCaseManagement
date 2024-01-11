// CaseManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CaseManagement.css';
import { useNavigate } from 'react-router-dom';

const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all cases from the server
    axios.get('http://localhost:3001/get-cases-staff')
      .then(response => {
        console.log('Cases:', response.data.cases);
        setCases(response.data.cases);
      })
      .catch(error => console.error('Error fetching cases:', error));
  }, []);

  const handleCreateCaseClick = () => {
    // Navigate to CreateCaseForm
    navigate('/CreateCaseForm');
  };

  const handleBackClick = () => {
    // Navigate to CreateCaseForm
    navigate('/Home');
  };

  return (
    <div className="case-management">
      <h2>Case Management</h2>
      <button className="create-case-button" onClick={handleCreateCaseClick}>
          Create Case
        </button>
       <button className="create-back-button" onClick={handleBackClick}>
          Back
        </button>
      {cases.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Case Name</th>
              <th>Case Type</th>
              <th>Case Status</th>
              <th>Staff Name</th>
              <th>Client Name</th>
              <th>Case Details</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem, index) => (
              <tr key={index}>
                <td>{caseItem.case_name}</td>
                <td>{caseItem.case_type}</td>
                <td>{caseItem.case_status}</td>
                <td>{caseItem.staff_name}</td>
                <td>{caseItem.client_name}</td>
                <td>{caseItem.case_detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cases available.</p>
      )}
    </div>
  );
};

export default CaseManagement;
