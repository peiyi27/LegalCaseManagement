import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import legalHomeLogo from './logo.png';
import axios from 'axios';
import clientLogo from './client-logo.png';
import caseLogo from './case-logo.png';
import './HomeForStaff.css';

const HomePage = () => {
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

    
    axios.get('http://localhost:3001/profile-get-admin-name')
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
 
    // Fetch counts from the server using Axios
    axios.get(`${baseUrl}/api/staff-count-for-client`)
      .then((response) => response.data)
      .then((data) => {
        setClientCount(data.clientCount);
      })
      .catch((error) => console.error('Error fetching client count:', error));
  
    // Fetch case count from the server using Axios
    axios.get(`${baseUrl}/api/staff-count-for-case`)
      .then((response) => response.data)
      .then((data) => {
        setCaseCount(data.caseCount);
      })
      .catch((error) => console.error('Error fetching case count:', error))
      .finally(() => setLoading(false)); // Set loading to false when counts are fetched
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const handleHomeStaffClick = () => {
    navigate('/HomeForStaff');
  };

  const handleCaseManagementClick = () => {
    navigate('/CaseManagementStaff');
  };

  const handleEventManagementClick = () => {
    navigate('/EventManagementStaff');
  };

  const handleButtonClick1 = () => {
    navigate('/CaseManagementStaff');
  };


  return (
    <div>
      <header className="main-top-nav">
        <div>
          <h1 className="main-header">Apex Legal Solution</h1>
        </div>
        <div>
          <div className="main-notification-container" onClick={() => navigate('/AlertNotificationManagement')}>
            <FontAwesomeIcon icon={faBell} className="main-custom-bell-icon" />
            </div>
          <div className="main-setting-container1" onClick={() => navigate('/ProfileSettingStaff')}>
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
               <a href="#home" onClick={handleHomeStaffClick}>Home</a>
           </li>
            <li>
              <a href="#casematter" onClick={handleCaseManagementClick}>
                My Cases
              </a>
            </li>
            <li>
              <a href="#casematter" onClick={handleEventManagementClick}>
                My Events
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <h2 className="main-welcome-message">Welcome, {adminName}!</h2>
        <div className="staff-count-boxes">
          <div className="staff-count-box">
            <img src={clientLogo} alt="Client Logo" className="staff-count-box-image" />
            <div className="staff-count-box-content">
              <p className="staff-count-box-label">Total Client</p>
              <p className="staff-count-box-value">{clientCount}</p>
            </div>
          </div>
          <div className="staff-count-box">
            <img src={caseLogo} alt="Case Logo" className="count-box-image" />
            <div className="staff-count-box-content">
              <p className="staff-count-box-label">Total Case</p>
              <p className="staff-count-box-value">{caseCount}</p>
            </div>
          </div>
        </div>
        <div className="main-button-container">
  <button className="main-action-button main-button1" onClick={handleButtonClick1}>
  Take charge of your client cases
  </button>
</div>
      </main>
    </div>
  );
};

export default HomePage;
