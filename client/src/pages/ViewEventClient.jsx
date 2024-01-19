//ViewEventClient.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ViewEventClient.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AlertNotificationManagement from './AlertNotificationManagement';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import legalHomeLogo from './logo.png';
import caseLogo from './case-logo.png';
import { faBell } from '@fortawesome/free-solid-svg-icons';


const ViewEventClient = () => {
  const [caseData, setCaseData] = useState({});
  const { caseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch case details by caseId
    axios.get(`http://localhost:3001/events/${caseId}`)
      .then(response => {
        console.log('Event Details:', response.data.caseData);
        setCaseData(response.data.caseData);
      })
      .catch(error => console.error('Error fetching case details:', error));
  }, [caseId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCaseManagementClick = () => {
    navigate('/CaseManagementClient');
  };

  const handleEventManagementClick = () => {
    navigate('/EventManagementClient');
  };
  
  const handleBackClick = () => {
    // Navigate to Home
    navigate('/HomeForClient');
  };
  
  return (
    <div>
      <header className="client-top-nav">
        <div>
          <h1 className="client-header">Apex Legal Solution</h1>
        </div>
        <div>
        <div className="main-notification-container">
          <AlertNotificationManagement />
          </div>
          <div className="client-setting-container1" onClick={() => navigate('/ProfileSettingClient')}>
            <FontAwesomeIcon icon={faCog} className="client-custom-icon1" />
          </div>
          <div className="client-icon-container2" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="client-custom-icon2" />
          </div>
        </div>
      </header>
      <aside className="client-side-nav">
        <nav>
          <ul>
            <li>
              <img src={legalHomeLogo} alt="Legal Logo" className="logo-test" />
            </li>
            <li>
              <a href="#casematter" onClick={handleCaseManagementClick}>
                Case Management
              </a>
            </li>
            <li>
              <a href="#casematter" onClick={handleEventManagementClick}>
                Event Management
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    <div className='container'>
      <h2 className='view-event-title'>Event Information</h2>
      <p>Event Id: {caseData.event_id}</p>
      <p>Event Name: {caseData.event_name}</p>
      <p>Event Description: {caseData.event_desc}</p>
      <p>Event Date: {caseData.event_date}</p>
      <p>Event Time Start: {caseData.event_time_start}</p>
      <p>Event Time End: {caseData.event_time_end}</p>
      <p>Event Location: {caseData.event_location}</p>
      <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
    </div>
  </div>  
  );
};

export default ViewEventClient;
