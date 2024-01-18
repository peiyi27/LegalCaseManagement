//ViewEventClient.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewEventClient.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import legalHomeLogo from './logo.png';
import caseLogo from './case-logo.png';
import { Link } from 'react-router-dom';


const ViewEventClient = () => {
  const [caseData, setCaseData] = useState({});
  const { caseId } = useParams();

  useEffect(() => {
    // Fetch case details by caseId
    axios.get(`http://localhost:3001/events/${caseId}`)
      .then(response => {
        console.log('Event Details:', response.data.caseData);
        setCaseData(response.data.caseData);
      })
      .catch(error => console.error('Error fetching case details:', error));
  }, [caseId]);

  return (
    <div>
      <h2>Event Information</h2>
      <p>Event Id: {caseData.event_id}</p>
      <p>Event Name: {caseData.event_name}</p>
      <p>Event Description: {caseData.event_desc}</p>
      <p>Event Date: {caseData.event_date}</p>
      <p>Event Time Start: {caseData.event_time_start}</p>
      <p>Event Time End: {caseData.event_time_end}</p>
      <p>Event Location: {caseData.event_location}</p>
    </div>
  );
};

export default ViewEventClient;
