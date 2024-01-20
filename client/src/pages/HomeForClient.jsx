import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import legalHomeLogo from './logo.png';
import axios from 'axios';
import './HomeForClient.css';
import caseLogo from './case-logo.png';
import { Link } from 'react-router-dom';
import AlertNotificationManagement from './AlertNotificationManagement';

const HomeForClient = () => {
  const navigate = useNavigate();
  const [staffCount, setStaffCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [caseCount, setCaseCount] = useState(0);
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = 'http://localhost:3001'; // Adjust the base URL based on your server configuration

    axios.get('http://localhost:3001/profile-get-client-name')
    .then(response => {
      const { success, adminName, message } = response.data;

      if (success) {
        setAdminName(adminName);
      } else {
        setError(message);
      }
    })
    .catch(error => {
      console.error(error);
      setError('Internal Server Error');
    })
    .finally(() => {
      setLoading(false);
    });
  
   
    // Fetch case count from the server using Axios
    axios.get(`${baseUrl}/api/client-count-for-case`)
      .then((response) => response.data)
      .then((data) => {
        setCaseCount(data.caseCount);
      })
      .catch((error) => console.error('Error fetching case count:', error))
      .finally(() => setLoading(false)); // Set loading to false when counts are fetched
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleHomeClientClick = () => {
    navigate('/HomeForClient');
  };

  const handleCaseManagementClick = () => {
    navigate('/CaseManagementClient');
  };

  const handleEventManagementClick = () => {
    navigate('/EventManagementClient');
  };
  

  const handleButtonClick1 = () => {
    navigate('/CaseManagementClient');
  };

  return (
    <div>
      <header className="main-top-nav">
      <div>
          <h1 className="main-header">Apex Legal Solution</h1>
        </div>
        <div>
        <div className="main-notification-container">
          <AlertNotificationManagement />
          </div>
          <div className="main-setting-container1" onClick={() => navigate('/ProfileSettingClient')}>
            <FontAwesomeIcon icon={faCog} className="main-custom-icon1" />
          </div>
          <div className="main-icon-container2" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="main-custom-icon2" />
          </div>
        </div>
      </header>
      <aside className="main-side-nav">
        <nav>
          <ul>
            <li>
              <img src={legalHomeLogo} alt="Legal Logo" className="logo-test" />
            </li>
            <li>
               <a href="#home" onClick={handleHomeClientClick} style={{ color: '#f6d41e' }}>Home</a>
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
      <main className="main-content">
        <h2 className="main-welcome-message">Welcome, {adminName}!</h2>
        <div className="client-count-boxes">
          <div className="client-count-box">
            <img src={caseLogo} alt="Case Logo" className="client-count-box-image" />
            <div className="client-count-box-content">
              <p className="client-count-box-label">Total Case</p>
              <p className="client-count-box-value">{caseCount}</p>
            </div>
          </div>
        </div>
        <div className="main-button-container">
          <button className="main-action-button main-button1" onClick={handleButtonClick1}>
            Explore and View Personal Case
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomeForClient;
