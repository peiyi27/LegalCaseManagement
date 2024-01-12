import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import legalHomeLogo from './logo.png';
import axios from 'axios';
import './HomeForStaff.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [staffCount, setStaffCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [caseCount, setCaseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = 'http://localhost:3001'; // Adjust the base URL based on your server configuration
  
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

  const handleCaseManagementClick = () => {
    navigate('/CaseManagementStaff');
  };


  return (
    <div>
      <header className="home-top-nav">
        <div>
          <img src={legalHomeLogo} alt="Legal Logo" className="logohome" />
          <h1 className="home-header">Apex Legal Solution</h1>
        </div>
        <div>
          <div className="setting-container1" onClick={() => navigate('/ProfileSettingStaff')}>
            <FontAwesomeIcon icon={faCog} className="custom-icon1" />
          </div>
          <div className="icon-container2" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="custom-icon2" />
          </div>
        </div>
      </header>
      <aside className="home-side-nav">
        <nav>
          <ul>
            <li>
              <a href="#casematter" onClick={handleCaseManagementClick}>
                My Case
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="home-content">
          <p>Client Count: {clientCount}</p>
          <p>Case Count: {caseCount}</p>
      </main>
    </div>
  );
};

export default HomePage;
