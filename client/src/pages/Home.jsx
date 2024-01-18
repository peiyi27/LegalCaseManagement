import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import legalHomeLogo from './logo.png';
import clientLogo from './client-logo.png';
import staffLogo from './staff-logo.png';
import adminLogo from './admin-logo.png';
import caseLogo from './case-logo.png';
import axios from 'axios';
import './Home.css';

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
    axios.get(`${baseUrl}/api/count-for-client`)
      .then((response) => response.data)
      .then((data) => {
        setClientCount(data.clientCount);
      })
      .catch((error) => console.error('Error fetching client count:', error));
  
    // Fetch staff count from the server using Axios
    axios.get(`${baseUrl}/api/count-for-staff`)
      .then((response) => response.data)
      .then((data) => {
        setStaffCount(data.staffCount);
      })
      .catch((error) => console.error('Error fetching staff count:', error));
  
    // Fetch admin count from the server using Axios
    axios.get(`${baseUrl}/api/count-for-admin`)
      .then((response) => response.data)
      .then((data) => {
        setAdminCount(data.adminCount);
      })
      .catch((error) => console.error('Error fetching admin count:', error));
  
    // Fetch case count from the server using Axios
    axios.get(`${baseUrl}/api/count-for-case`)
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

  const handleUserManagementClick = () => {
    navigate('/UserManagementAdmin');
  };

  const handleCaseManagementClick = () => {
    navigate('/CaseManagementAdmin');
  };

  const handleEventManagementClick = () => {
    navigate('/EventManagementClient');
  };

  const handleMyCaseClick = () => {
    navigate('/MyCaseAdmin');
  };

  const handleButtonClick1 = () => {
    navigate('/UserManagementAdmin');
  };

  const handleButtonClick2 = () => {
    navigate('/CaseManagementAdmin');
  };


  const handleButtonClick3 = () => {
    navigate('/MyCaseAdmin');
  };

 
  return (
    <div>
      <header className="admin-top-nav">
        <div>
          <img src={legalHomeLogo} alt="Legal Logo" className="admin-logohome" />
          <h1 className="admin-header">Apex Legal Solution</h1>
        </div>
        <div>
        <div className="admin-notification-container" onClick={() => navigate('/AlertNotificationManagement')}>
            <FontAwesomeIcon icon={faBell} className="admin-custom-bell-icon" />
          </div>
          <div className="admin-setting-container1" onClick={() => navigate('/ProfileSettingAdmin')}>
            <FontAwesomeIcon icon={faCog} className="admin-custom-icon1" />
          </div>
          <div className="admin-icon-container2" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="admin-custom-icon2" />
          </div>
        </div>
      </header>
      <aside className="admin-side-nav">
        <nav>
          <ul>
            <li>
              <a href="#clients" onClick={handleUserManagementClick}>User Management</a>
            </li>
            <li>
              <a href="#case" onClick={handleCaseManagementClick}>Case Management</a>
            </li>
            <li>
              <a href="#casematter" onClick={handleEventManagementClick}>
                Event Management
              </a>
            </li>
            <li>
              <a href="#casematter" onClick={handleMyCaseClick}>
                My Case
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <h2 className="admin-welcome-message">Welcome, {adminName}!</h2>
        <div className="admin-count-boxes">
          <div className="admin-count-box">
            <img src={clientLogo} alt="Client Logo" className="admin-count-box-image" />
            <div className="admin-count-box-content">
              <p className="admin-count-box-label">Total Client In Firm</p>
              <p className="admin-count-box-value">{clientCount}</p>
            </div>
          </div>
          <div className="admin-count-box">
            <img src={staffLogo} alt="Admin Logo" className="admin-count-box-image" />
            <div className="admin-count-box-content">
              <p className="admin-count-box-label">Total Admin In Firm</p>
              <p className="admin-count-box-value">{adminCount}</p>
            </div>
          </div>
          <div className="admin-count-box">
            <img src={staffLogo} alt="Staff Logo" className="admin-count-box-image" />
            <div className="admin-count-box-content">
              <p className="admin-count-box-label">Total Staff In Firm</p>
              <p className="admin-count-box-value">{staffCount}</p>
            </div>
          </div>
          <div className="admin-count-box">
            <img src={staffLogo} alt="Case Logo" className="admin-count-box-image" />
            <div className="admin-count-box-content">
              <p className="admin-count-box-label">Total Case In Firm</p>
              <p className="admin-count-box-value">{caseCount}</p>
            </div>
          </div>
          {/* Removed Total Admin and Total Case count boxes */}
        </div>
        <div className="admin-button-container">
          <button className="admin-action-button admin-button1" onClick={handleButtonClick1}>
            Explore and manage users within the firm
            <span className="admin-tooltip">Explore and manage users within the firm</span>
          </button>
          <button className="admin-action-button admin-button2" onClick={handleButtonClick2}>
            Navigate and manage all cases across the firm
            <span className="admin-tooltip">Navigate and manage all cases across the firm</span>
          </button>
          <button className="admin-action-button admin-button3" onClick={handleButtonClick3}>
            Take charge of your client cases and interactions
            <span className="admin-tooltip">Take charge of your client cases and interactions</span>
          </button>
        </div>
      </main>
    </div>
  );
  
};

export default HomePage;
