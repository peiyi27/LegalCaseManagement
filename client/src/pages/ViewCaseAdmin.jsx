// ViewCase.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewCaseAdmin.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const ViewCaseAdmin = () => {
  const [caseData, setCaseData] = useState({});
  const { caseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch case details by caseId
    axios.get(`http://localhost:3001/get-case-details/${caseId}`)
      .then(response => {
        console.log('Case Details:', response.data.caseData);
        setCaseData(response.data.caseData);
      })
      .catch(error => console.error('Error fetching case details:', error));
  }, [caseId]);

  const handleBackClick = (caseId) => {
    navigate(`/CaseManagementAdmin`);
    // Handle Edit button click, you can navigate to an edit page or perform any action
  };

  return (
    <div className="admin-view-case-container">
      <h2 className="admin-view-case-title">Case Information</h2>
      <p className="admin-view-case-info-item">Case Id: {caseData.case_id}</p>
      <p className="admin-view-case-info-item">Case Name: {caseData.case_name}</p>
      <p className="admin-view-case-info-item">Case Type: {caseData.case_type}</p>
      <p className="admin-view-case-info-item">Case Status: {caseData.case_status}</p>
      <p className="admin-view-case-info-item">Case Created Date: {caseData.create_case_date}</p>
      <p className="admin-view-case-info-item">Staff Name: {caseData.staff_name}</p>
      <p className="admin-view-case-info-item">Client Name: {caseData.client_name}</p>
      <p className="admin-view-case-info-item">Details: {caseData.case_detail}</p>
      {/* Add more details as needed */}
      <button  className="admin-view-case-button" onClick={handleBackClick}>
          Back
        </button>
    </div>
  );
};

export default ViewCaseAdmin;